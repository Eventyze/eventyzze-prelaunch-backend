import { ResponseDetails } from "../../types/generalTypes";
import { errorUtilities, mailUtilities } from "../../utilities";
import validator from "validator";
import { JwtPayload } from "jsonwebtoken";
import { eventRepositories, userRepositories } from "../../repositories";
import { UserAttributes } from "../../types/modelTypes";
import { generalHelpers } from "../../helpers";
import { Op } from "sequelize";
import handleServicesResponse from "../../utilities/responseHandlers/response.utilities";

const userProfileUpdateService = errorUtilities.withErrorHandling(
  async (profilePayload: Record<string, any>): Promise<Record<string, any>> => {
    const { body } = profilePayload;

    const { id } = profilePayload;

    const user: any = await userRepositories.userRepositories.getOne({ id });

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

    if (body.address) {
      updateDetails.address = body.address.trim();
    }

    const newUser = await userRepositories.userRepositories.updateOne(
      { id },
      updateDetails
    );

    return handleServicesResponse.handleServicesResponse(
      200,
      "Profile updated successfully",
      newUser
    );
  }
);

const updateUserImageService = errorUtilities.withErrorHandling(
  async (imageUrl: string, id: string): Promise<any> => {
    if (!imageUrl) {
      throw errorUtilities.createError("Select an Image", 400);
    }

    const newMovie: any = await userRepositories.userRepositories.updateOne(
      {
        id,
      },
      {
        userImage: imageUrl,
      }
    );
    return handleServicesResponse.handleServicesResponse(
      200,
      "Movie image changed successfully",
      newMovie
    );
  }
);

const userfirstimeProfileUpdateService = errorUtilities.withErrorHandling(
  async (profilePayload: Record<string, any>): Promise<Record<string, any>> => {
    let {
      id,
      userName,
      bio,
      interests,
      phone,
      fullName,
      state,
      country,
      address,
      stateCode,
      countryCode,
      deviceId,
    } = profilePayload;

    const user = (await userRepositories.userRepositories.getOne({
      id,
    })) as unknown as UserAttributes;

    if (!user) {
      throw errorUtilities.createError("User not found", 404);
    }

    if (!validator.isMobilePhone(phone, "any")) {
      throw errorUtilities.createError("Invalid phone number", 400);
    }
    let userEventyzzeId;

    try {
      userEventyzzeId = await generalHelpers.generateUniqueUserEventyzzeId(
        countryCode,
        stateCode
      );
    } catch (error) {
      throw errorUtilities.createError(
        "Failed to generate unique identifier, please try again",
        500
      );
    }


    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await generalHelpers.generateTokens(tokenPayload, "2h");
    const refreshToken = await generalHelpers.generateTokens(
      tokenPayload,
      "30d"
    );

    
    if (!user.refreshToken || !user.isInitialProfileSetupDone) {
      let mailMessage = "";
      let mailSubject = "";
      mailMessage = `Welcome to Eventyzze ${
        user.fullName ? user.fullName : ""
      }! <br /><br />

          We're excited to have you on board. Eventyzze is your go-to platform for discovering, organizing, and sharing amazing events. Whether you're attending or hosting, we're here to make your experience seamless and enjoyable. <br /> <br />

          If you have any questions or need help getting started, feel free to reach out to our support team. We're always here to assist you. <br /> <br />

          Let's make some unforgettable moments together!`;

      mailSubject = `Welcome to Eventyzze ${
        user.fullName ? user.fullName : ""
      }`;
      await mailUtilities.sendMail(user.email, mailMessage, mailSubject);
    }

    profilePayload.eventyzzeId = userEventyzzeId;

    profilePayload.isInitialProfileSetupDone = true;

    profilePayload.refreshToken = refreshToken;

    profilePayload.activeDeviceId = deviceId;

    const newUser = await userRepositories.userRepositories.updateOne(
      { id },
      profilePayload
    );

    const userData = { user: newUser, accessToken, refreshToken }

    return handleServicesResponse.handleServicesResponse(
      200,
      "Profile updated successfully",
      userData
    );
  }
);

const confirmUserNameService = errorUtilities.withErrorHandling(
  async (userName: string) => {
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
    return handleServicesResponse.handleServicesResponse(
      200,
      "Username Available"
    );
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

const getAllLiveEventsService = errorUtilities.withErrorHandling(
  async (): Promise<Record<string, any>> => {

    const projection = [
      'id',
      'eventTitle',
      'ownerName',
      'coverImage',
      'isLive'
    ]
    const events: any = await eventRepositories.eventRepositories.getMany({
      isLive: true,
    }, projection);

    if (!events) {
      throw errorUtilities.createError("Unable to fetch Events", 404);
    }
    return handleServicesResponse.handleServicesResponse(
      200,
      "Live Events fetched successfully",
      events
    );
  }
);

const getNewEvents = errorUtilities.withErrorHandling(async () => {

  const projection = [
    'id',
    'eventTitle',
    'ownerName',
    'coverImage',
    'isLive'
  ]

  const events = await eventRepositories.eventRepositories.getMany(
    {},
    projection,
    {},
    [["createdAt", "DESC"]]
  );
  if (!events) {
    throw errorUtilities.createError("Unable to fetch Events", 404);
  }
  return handleServicesResponse.handleServicesResponse(
    200,
    "New Events fetched successfully",
    events
  );
});

const getDiscoverEvents = errorUtilities.withErrorHandling(
  async (userId: string) => {

    const user = (await userRepositories.userRepositories.getOne(
      { id: userId },
      ["interests", "id"]
    )) as unknown as UserAttributes;

    const events = await eventRepositories.eventRepositories.getMany({
      category: { [Op.overlap]: user.interests },
    });

    if (!events) {
      throw errorUtilities.createError("Unable to fetch Events", 404);
    }

    return handleServicesResponse.handleServicesResponse(
      200,
      "Events fetched successfully",
      events
    );

  }
);

const getRecordedEvents = errorUtilities.withErrorHandling(async () => {

  const projection = [
    'id',
    'eventTitle',
    'ownerName',
    'coverImage',
    'isLive'
  ]

  const events = await eventRepositories.eventRepositories.getMany({
    isRecorded: true,
  }, projection);

  if (!events) {
    throw errorUtilities.createError("Unable to fetch Events", 404);
  }

  return handleServicesResponse.handleServicesResponse(
    200,
    "Recorded Events fetched successfully",
    events
  );

});

const getAllEvents = errorUtilities.withErrorHandling(async () => {

  const events = await eventRepositories.eventRepositories.getMany({});

  if (!events) {
    throw errorUtilities.createError("Unable to fetch Events", 404);
  }

  return handleServicesResponse.handleServicesResponse(
    200,
    "All Events fetched successfully",
    events
  );

});

const getTrendingEvents = errorUtilities.withErrorHandling(
  async () => {

    const projection = [
      'id',
      'eventTitle',
      'ownerName',
      'coverImage',
      'isLive'
    ]

    const events = await eventRepositories.eventRepositories.getMany(
      {},
      projection,
      {},
      [["noOfLikes", "DESC"]]
    );

    if (!events)
      return handleServicesResponse.handleServicesResponse(
        404,
        "Unable to fetch events",
        null
      );

    return handleServicesResponse.handleServicesResponse(
      200,
      "Trending Events fetched successfully",
      events
    );
    
  }
);

export default {
  userProfileUpdateService,
  updateUserImageService,
  userSwitchesToHostService,
  userfirstimeProfileUpdateService,
  getAllLiveEventsService,
  getNewEvents,
  getDiscoverEvents,
  getRecordedEvents,
  getAllEvents,
  confirmUserNameService,
  getTrendingEvents,
};
