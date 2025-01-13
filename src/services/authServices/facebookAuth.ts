import { ResponseDetails } from "../../types/generalTypes";
import { errorUtilities } from "../../utilities";
import { v4 } from "uuid";
import { Roles, UserAttributes } from "../../types/modelTypes";
import { generalHelpers } from "../../helpers";
import axios from "axios";
import { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } from "../../configurations/envKeys";
import {
  userRepositories,
  walletRepositories,
  followingsRepositories,
  folowersRepositories,
} from "../../repositories";
import performTransaction from "../../middlewares/databaseTransactions.middleware";
import { Transaction } from "sequelize";

const facebookAuthService = errorUtilities.withErrorHandling(
  async (accessToken: string): Promise<Record<string, any>> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
      data: {},
      details: {},
      info: {},
    };

    // Verify the access token with Facebook
    const appAccessTokenResponse = await axios.get(
      `https://graph.facebook.com/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&grant_type=client_credentials`
    );

    const appAccessToken = appAccessTokenResponse.data.access_token;

    // Debug the access token
    const debugTokenResponse = await axios.get(
      `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appAccessToken}`
    );

    if (!debugTokenResponse.data.data.is_valid) {
      throw errorUtilities.createError("Invalid Facebook token", 400);
    }

    // Get user data from Facebook
    const userDataResponse = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    const { email, name, picture } = userDataResponse.data;

    if (!email) {
      throw errorUtilities.createError("Email not provided from Facebook", 400);
    }

    const existingUser: UserAttributes | any = await userRepositories.userRepositories.getOne({ email });

    if (existingUser) {
      const tokenPayload = {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      };

      const accessToken = await generalHelpers.generateTokens(tokenPayload, "2h");
      const refreshToken = await generalHelpers.generateTokens(tokenPayload, "30d");

      existingUser.refreshToken = refreshToken;
      await existingUser.save();

      const userWithoutPassword = await userRepositories.userRepositories.extractUserDetails(existingUser);

      responseHandler.statusCode = 200;
      responseHandler.message = "Login successful";
      responseHandler.data = {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      };
      return responseHandler;
    }

    // Create new user
    const userId = v4();

    const walletPayload = {
      id: v4(),
      userId,
      totalBalance: 0,
    };

    const followersPayload = {
      id: v4(),
      userId,
      followers: [],
    };

    const followingsPayload = {
      id: v4(),
      userId,
      followings: [],
    };

    const userCreationPayload = {
      id: userId,
      email,
      fullName: name,
      userImage: picture?.data?.url, // Facebook returns picture in a different format
      isVerified: true,
      role: Roles.User,
    };

    const operations = [
      async (transaction: Transaction) => {
        await userRepositories.userRepositories.create(userCreationPayload, transaction);
      },
      async (transaction: Transaction) => {
        await walletRepositories.walletRepositories.create(walletPayload, transaction);
      },
      async (transaction: Transaction) => {
        await folowersRepositories.followersRepositories.create(followersPayload, transaction);
      },
      async (transaction: Transaction) => {
        await followingsRepositories.followingsRepositories.create(followingsPayload, transaction);
      },
    ];

    await performTransaction.performTransaction(operations);

    const newUser: UserAttributes | any = await userRepositories.userRepositories.getOne({ id: userId });

    const tokenPayload = {
      id: userId,
      email,
      role: Roles.User,
    };

    const jwtAccessToken = await generalHelpers.generateTokens(tokenPayload, "2h");
    const refreshToken = await generalHelpers.generateTokens(tokenPayload, "30d");

    newUser.refreshToken = refreshToken;
    await newUser.save();

    const userWithoutPassword = await userRepositories.userRepositories.extractUserDetails(newUser);

    responseHandler.statusCode = 201;
    responseHandler.message = "Account created successfully";
    responseHandler.data = {
      user: userWithoutPassword,
      accessToken: jwtAccessToken,
      refreshToken,
    };
    return responseHandler;
  }
);

export default {
  facebookAuthService,
};