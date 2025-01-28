import { ResponseDetails } from "../../types/generalTypes";
import { errorUtilities } from "../../utilities";
import validator from "validator";
import { JwtPayload } from "jsonwebtoken";
import { userRepositories } from "../../repositories";
import { UserAttributes } from "types/modelTypes";

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
      (!body.address || body.address === "")
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
      updateDetails.bio = body.bio.trim();
    }

    if (body.interests) {
      updateDetails.interests = body.interests;
    }

    if (body.phone) {
      if (!validator.isMobilePhone(body.phone, "any")) {
        throw errorUtilities.createError("Invalid phone number", 400);
      }
      updateDetails.phone = body.phone.trim();
    }

    if (body.fullName) {
      updateDetails.fullName = body.fullName.trim();
    }

    if (body.country) {
      updateDetails.country = body.country.trim();
    }

    if (body.state) {
      updateDetails.country = body.country.trim();
    }

    if(body.address){
      updateDetails.address = body.address.trim()
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

const userfirstimeProfileUpdateService = errorUtilities.withErrorHandling(
  async (profilePayload: Record<string, any>): Promise<Record<string, any>> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
      data: {},
      details: {},
      info: {},
    };

    
    const {
      id,
      userName,
      bio,
      interests,
      phone,
      fullName,
      address
    } = profilePayload
    
    const user = await userRepositories.userRepositories.getOne({id}) as unknown as UserAttributes;
    
    if (!user) {
      throw errorUtilities.createError("User not found", 404);
    }

      const confirmUserName = await userRepositories.userRepositories.getOne(
        { userName },
        ["userName"]
      );

      if (confirmUserName) {
        throw errorUtilities.createError(
          "Username unavailable, please choose another username",
          400
        );
      }

      if (!validator.isMobilePhone(phone, "any")) {
        throw errorUtilities.createError("Invalid phone number", 400);
      }

    const newUser = await userRepositories.userRepositories.updateOne(
      { id },
      profilePayload
    );

    responseHandler.statusCode = 200;
    responseHandler.message = "Profile updated successfully";
    responseHandler.data = {
      user: newUser,
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
  userfirstimeProfileUpdateService
};
