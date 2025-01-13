import { ResponseDetails } from "../../types/generalTypes";
import { errorUtilities } from "../../utilities";
import { v4 } from "uuid";
import { Roles, UserAttributes } from "../../types/modelTypes";
import { generalHelpers } from "../../helpers";
import { OAuth2Client } from "google-auth-library";
import { GOOGLE_CLIENT_ID } from "../../configurations/envKeys";
import {
  userRepositories,
  walletRepositories,
  followingsRepositories,
  folowersRepositories,
} from "../../repositories";
import performTransaction from "../../middlewares/databaseTransactions.middleware";
import { Transaction } from "sequelize";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const googleAuthService = errorUtilities.withErrorHandling(
  async (token: string): Promise<Record<string, any>> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
      data: {},
      details: {},
      info: {},
    };

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    if (!payload) {
      throw errorUtilities.createError("Invalid token", 400);
    }

    const { email, name, picture } = payload;

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
      userImage: picture,
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

    const accessToken = await generalHelpers.generateTokens(tokenPayload, "2h");
    const refreshToken = await generalHelpers.generateTokens(tokenPayload, "30d");

    newUser.refreshToken = refreshToken;
    await newUser.save();

    const userWithoutPassword = await userRepositories.userRepositories.extractUserDetails(newUser);

    responseHandler.statusCode = 201;
    responseHandler.message = "Account created successfully";
    responseHandler.data = {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
    return responseHandler;
  }
);

export default {
  googleAuthService,
};