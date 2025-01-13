import { ResponseDetails } from "../../types/generalTypes";
import { errorUtilities } from "../../utilities";
import validator from "validator";
import { JwtPayload } from "jsonwebtoken";
import { userRepositories } from "../../repositories";

const userProfileUpdateService = errorUtilities.withErrorHandling(
  async (profilePayload: Record<string, any>): Promise<Record<string, any>> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
      data: {},
      details: {},
      info: {},
    };

    const { body } = profilePayload;

    const { id } = profilePayload;

    const user: any = await userRepositories.userRepositories.getOne({id});

    if (
      (!body.userName || body.userName === "") &&
      (!body.bio || body.bio === "") &&
      (!body.interests ||
        !Array.isArray(body.interests) ||
        body.interests.length === 0) &&
      (!body.phone || body.phone === "") &&
      (!body.fullName || body.fullName === "") &&
      (!body.country || profilePayload.country === "")
    ) {
      throw errorUtilities.createError(
        "At least one field must be selected for update",
        400
      );
    }

    let updateDetails: Record<string, any> = {};

    if (body.userName) {
      if (body.userName === user.userName) {
        throw errorUtilities.createError(
          "This is your current username, please choose another username if you wish to change it",
          400
        );
      }
      const confirmUserName = await userRepositories.userRepositories.getOne(
        { userName: body.userName },
        ["userName"]
      );

      if (confirmUserName) {
        throw errorUtilities.createError(
          "Username unavailable, please choose another username",
          400
        );
      }

      updateDetails.userName = body.userName;
    }

    if (body.bio) {
      updateDetails.bio = body.bio;
    }

    if (body.interests) {
      updateDetails.interests = body.interests;
    }

    if (body.phone) {
      if (!validator.isMobilePhone(body.phone, "any")) {
        throw errorUtilities.createError("Invalid phone number", 400);
      }
      updateDetails.phone = body.phone;
    }

    if (body.fullName) {
      updateDetails.fullName = body.fullName;
    }

    if (body.country) {
      updateDetails.country = body.country;
    }

    if (!user.isInitialProfileSetupDone) {
      updateDetails.isInitialProfileSetupDone = true;
    }

    const newUser = await userRepositories.userRepositories.updateOne(
      { id },
      updateDetails
    );

    responseHandler.statusCode = 200;
    responseHandler.message = "Profile updated successfully";
    responseHandler.data = {
      user: newUser,
    };
    return responseHandler;
  }
);

const updateUserImageService = errorUtilities.withErrorHandling(
  async (request: JwtPayload): Promise<any> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
    };

      const imageUpdate = request?.file?.path;
      console.log('imageUpdate', imageUpdate)

      if (!imageUpdate) {
        throw errorUtilities.createError("Select an Image", 400);
      }

    const { id } = request.user;

    const newMovie: any = await userRepositories.userRepositories.updateOne(
      {
        id,
      },
      {
        userImage: imageUpdate
      }
    );

    responseHandler.statusCode = 200;
    responseHandler.message = "Movie image changed successfully";
    responseHandler.data = {
      mmovie: newMovie,
    };
    return responseHandler;
  }
);

const userSwitchesToHostService = errorUtilities.withErrorHandling(
  async (userPayload: Record<string, any>): Promise<Record<string, any>> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
      data: {},
      details: {},
      info: {},
    };

    return responseHandler;
  }
);


export default {
  userProfileUpdateService,
  updateUserImageService,
  userSwitchesToHostService,
};
