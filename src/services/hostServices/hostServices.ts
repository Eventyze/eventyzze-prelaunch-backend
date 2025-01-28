import { ResponseDetails } from "../../types/generalTypes";
import { errorUtilities, mailUtilities } from "../../utilities";
import validator from "validator";
import { JwtPayload } from "jsonwebtoken";
import { Roles, SubscriptionPlans, UserAttributes } from "../../types/modelTypes";
import { eventRepositories, userRepositories, walletRepositories } from "../../repositories";
import { v4 } from "uuid";
import { Transaction } from "sequelize";

const getAllHostsService = errorUtilities.withErrorHandling(
  async (): Promise<Record<string, any>> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
      data: {},
      details: {},
      info: {},
    };

    const projection = [
        "id",
        "fullName",
        "userName",
        "numberOfEventsHosted",
        "numberOfEventsAttended",
        "userImage",
        "noOfFollowers"
    ]

    const hosts: any = await userRepositories.userRepositories.getMany({role:Roles.Host}, projection);

    if(!hosts || hosts.length === 0){
        responseHandler.statusCode = 404;
        responseHandler.message = "No hosts found";
        responseHandler.data = {
            hosts
        }
        return responseHandler;
    }

    responseHandler.statusCode = 200;
    responseHandler.message = "Profile updated successfully";
    responseHandler.data = {
      hosts
    };
    return responseHandler;
  }
);

const hostCreatesEventService = errorUtilities.withErrorHandling(
  async (userId: string, eventCreationDetails:Record<string, any>): Promise<Record<string, any>> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
      data: {},
      details: {},
      info: {},
    };

    const projection = [
      "id",
      "role",
      "fullName",
      "userName",
      "numberOfEventsHosted",
      "numberOfEventsAttended",
      "userImage",
      "noOfFollowers"
  ]

    const user = await userRepositories.userRepositories.getOne({id:userId}, projection) as unknown as UserAttributes;

    if(!user){
      responseHandler.message = "User does not exist";
      responseHandler.statusCode = 404;
      return responseHandler;
    }

    if(user.role === Roles.User && user.isInitialHostingOfferExhausted){
      responseHandler.message = "You cannot Host an event unless you upgrade to a host";
      responseHandler.statusCode = 400;
      return responseHandler;
    }


    if(user.subscriptionDetails.type === SubscriptionPlans.Free){
      responseHandler.message = "You cannot Host an event unless you upgrade to a host";
      responseHandler.statusCode = 400;
      return responseHandler;
    }

    if(!user.subscriptionDetails.hasPaid){
      responseHandler.message = "Plan has expired, please pay again or upgrade before you can host an event";
      responseHandler.statusCode = 400;
      return responseHandler;
    }

    const eventId = v4()

    const eventPayload = {
      id: eventId,
      userId: user.id,
      description: eventCreationDetails.description,
      eventAd: eventCreationDetails.eventAd,
      date: eventCreationDetails.startDate,
      startTime: eventCreationDetails.eventTime,
      duration: eventCreationDetails.duration,
      endTime: eventCreationDetails.endTime,
      hostJoinTime: eventCreationDetails.hostJoinTime,
      cost: eventCreationDetails.cost,
      coverImage: eventCreationDetails.coverImage,
      noOfLikes: 0,
      noOfDislikes: 0
    }

    const eventWalletPayload = {
      id: v4(),
      ownerId: eventId,
      walletType: Roles.Event,
      totalBalance: 0,
    };

    const operations = [
      async (transaction: Transaction) => {
        await eventRepositories.eventRepositories.create(eventPayload, transaction)
      },

      async (transaction: Transaction) => {
        await walletRepositories.walletRepositories.create(
          eventWalletPayload,
          transaction
        );
      },

    ]

    await mailUtilities.sendMail(
      user.email,
      `Hello ${user.userName}, your event has been created, please do not forget to join on the selected date`,
      "Eventyzze Event Creation"
    );

    responseHandler.statusCode = 201;
    responseHandler.message = "Event created successfully"
    responseHandler.data = user;
    return responseHandler;

  })
export default {
    getAllHostsService,
    hostCreatesEventService,
}