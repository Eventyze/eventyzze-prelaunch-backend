import { ResponseDetails } from "../../types/generalTypes";
import {
  errorUtilities,
  mailUtilities,
  recieptUtilities,
} from "../../utilities";
import validator from "validator";
import { JwtPayload } from "jsonwebtoken";
import {
  AttendanceAttributes,
  EventAttributes,
  Roles,
  SubscriptionPlans,
  UserAttributes,
  WalletAttributes,
} from "../../types/modelTypes";
import {
  attendanceRepositories,
  eventRepositories,
  transactionRepositories,
  userRepositories,
  walletRepositories,
} from "../../repositories";
import dayjs from 'dayjs';
import { v4 } from "uuid";
import { Transaction } from "sequelize";
import { dyteHelpers, generalHelpers } from "../../helpers";
import performTransaction from "../../middlewares/databaseTransactions.middleware";
import { dyteServices } from "../../services";
import handleServicesResponse from "../../utilities/responseHandlers/response.utilities";

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
      "noOfFollowers",
      "newlyUpgraded",
      "phone",
      "eventyzzeId",
      "email",
      "role"
    ];

    const hosts: any = await userRepositories.userRepositories.getMany(
      { role: Roles.Host },
      projection,
      [
        ['newlyUpgraded', 'DESC'],
        ['createdAt', 'DESC'],
      ],

    );

    if (!hosts) {
      throw errorUtilities.createError('Unable to get hosts', 404)
    }
    return handleServicesResponse.handleServicesResponse(
      200,
      "Hosts fetched successfully",
      hosts
    );
  }
);

const hostCreatesEventService = errorUtilities.withErrorHandling(
  async (
    userId: string,
    eventCreationDetails: Record<string, any>
  ): Promise<Record<string, any>> => {
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
      "noOfFollowers",
      "subscriptionPlan",
      "subscriptionDetails",
      "email",
    ];

    const user = (await userRepositories.userRepositories.getOne(
      { id: userId },
      projection
    )) as unknown as UserAttributes;

    if (!user) {
      responseHandler.message = "User does not exist";
      responseHandler.statusCode = 404;
      return responseHandler;
    }

    if (user.role === Roles.User && user.isInitialHostingOfferExhausted) {
      responseHandler.message =
        "You cannot Host an event unless you upgrade to a host";
      responseHandler.statusCode = 400;
      return responseHandler;
    }

    if (
      user.subscriptionPlan !== SubscriptionPlans.Free &&
      new Date(user.subscriptionDetails?.dateOfExpiry) >= new Date()
    ) {
      responseHandler.message =
        "Plan has expired, please pay again or upgrade before you can host an event";
      responseHandler.statusCode = 400;
      return responseHandler;
    }

    if (
      user.subscriptionDetails.type === SubscriptionPlans.Free &&
      user.subscriptionDetails.hasPaid === false
    ) {
      responseHandler.message =
        "You cannot Host an event unless you upgrade to a host";
      responseHandler.statusCode = 400;
      return responseHandler;
    }

    let userDyteData;

    if (
      user.subscriptionDetails.type === SubscriptionPlans.Free ||
      user.subscriptionDetails.type === SubscriptionPlans.Bronze
    ) {
      userDyteData = dyteHelpers.bronzeUserDataGenerator(
        eventCreationDetails.eventTitle,
        eventCreationDetails.preferredRegion
      );
    } else if (user.subscriptionDetails.type === SubscriptionPlans.Silver) {
      userDyteData = dyteHelpers.silverUserDataGenerator(
        eventCreationDetails.eventTitle,
        eventCreationDetails.preferredRegion
      );
    } else if (user.subscriptionDetails.type === SubscriptionPlans.Gold) {
      userDyteData = dyteHelpers.goldUserDataGenerator(
        eventCreationDetails.eventTitle,
        eventCreationDetails.preferredRegion,
        eventCreationDetails.duration
      );
    } else if (user.subscriptionDetails.type === SubscriptionPlans.Platinum) {
      userDyteData = dyteHelpers.platinumUserDataGenerator(
        eventCreationDetails.eventTitle,
        eventCreationDetails.preferredRegion,
        eventCreationDetails.duration
      );
    }

    const dyteMeetingData = await dyteServices.createDyteMeeting(userDyteData);

    const eventId = v4();

    const formattedDate = dayjs(eventCreationDetails.date).format("YYYY-MM-DD");

    const endTime = generalHelpers.calculateEndTime(eventCreationDetails.startTime, eventCreationDetails.duration, formattedDate)

    const eventPayload: Partial<EventAttributes> = {
      id: eventId,
      userId: user.id,
      eventTitle: eventCreationDetails.eventTitle,
      description: eventCreationDetails.description,
      eventAd: eventCreationDetails.videoUrl,
      date: `${new Date(formattedDate)}`,
      startTime: eventCreationDetails.startTime,
      duration: eventCreationDetails.duration,
      endTime: `${new Date(endTime)}`,
      cost: eventCreationDetails.cost,
      currency: eventCreationDetails.currency,
      coverImage: eventCreationDetails.coverImage,
      videoUrl: eventCreationDetails.videoUrl,
      ownerName: user.userName,
      dyteDetails: {
        meetingId: dyteMeetingData.data.id,
        meetingTitle: dyteMeetingData.data.title,
        createdAt: dyteMeetingData.data.created_at,
        updatedAt: dyteMeetingData.data.updated_at,
      },
    };
    
    const eventWalletPayload = {
      id: v4(),
      ownerId: eventId,
      walletType: Roles.Event,
      totalBalance: 0,
    };

    const createEvent = await eventRepositories.eventRepositories.create(
      eventPayload
    );

    if (!createEvent)
      throw errorUtilities.createError(
        "Unable to create Event, please try again",
        400
      );

    const EventWallet = await walletRepositories.walletRepositories.create(
      eventWalletPayload
    );

    if (!EventWallet)
      throw errorUtilities.createError(
        "Unable to create Event, please try again",
        400
      );

    const newEvent = await eventRepositories.eventRepositories.getOne({
      id: eventId,
    });

    await mailUtilities.sendMail(
      user.email,
      `Hello ${user.userName}, your event has been created, please do not forget to join on the selected date`,
      "Eventyzze Event Creation"
    );

    responseHandler.statusCode = 201;
    responseHandler.message = "Event created successfully";
    responseHandler.data = newEvent;
    return responseHandler;
  }
);

const hostgetsAllTheirEventsService = errorUtilities.withErrorHandling(
  async (userId: string): Promise<Record<string, any>> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
      data: {},
      details: {},
      info: {},
    };

    const user = await userRepositories.userRepositories.getOne({ id: userId });

    if (!user) {
      responseHandler.message = "User not found";
      responseHandler.statusCode = 404;
      return responseHandler;
    }

    const userEvents = await eventRepositories.eventRepositories.getMany({
      userId,
    });

    responseHandler.message = "Events fetched successfully";
    responseHandler.statusCode = 200;
    responseHandler.data = { events: userEvents };
    return responseHandler;
  }
);

const hostGetsSingleEventService = errorUtilities.withErrorHandling(
  async (userId: string, eventId: string): Promise<Record<string, any>> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
      data: {},
      details: {},
      info: {},
    };

    const user = await userRepositories.userRepositories.getOne({ id: userId });

    if (!user) {
      responseHandler.message = "User not found";
      responseHandler.statusCode = 404;
      return responseHandler;
    }

    const singleEvent = await eventRepositories.eventRepositories.getOne({
      userId,
    });

    responseHandler.message = "Event fetched successfully";
    responseHandler.statusCode = 200;
    responseHandler.data = { event: singleEvent };
    return responseHandler;
  }
);

const hostDeletesEvent = errorUtilities.withErrorHandling(
  async (userId: string, eventId: string): Promise<Record<string, any>> => {
    const responseHandler: ResponseDetails = {
      statusCode: 0,
      message: "",
      data: {},
      details: {},
      info: {},
    };

    const user = await userRepositories.userRepositories.getOne({ id: userId });
    if (!user) {
      responseHandler.message = "User not found";
      responseHandler.statusCode = 404;
      return responseHandler;
    }

    const event = (await eventRepositories.eventRepositories.getOne({
      id: eventId,
    })) as unknown as EventAttributes;
    if (!event) {
      responseHandler.message = "Event not found";
      responseHandler.statusCode = 404;
      return responseHandler;
    }

    if (event.userId !== userId) {
      responseHandler.message = "You cannot delete an event you did not create";
      responseHandler.statusCode = 400;
      return responseHandler;
    }

    if (event.isLive) {
      responseHandler.message =
        "You cannot delete an event that is still ongoing. End the event first please";
      responseHandler.statusCode = 400;
      return responseHandler;
    }

    const attendees: any =
      (await attendanceRepositories.attendanceRepositories.getMany({
        eventId,
      })) as unknown as AttendanceAttributes;
    if (attendees.length && !event.isHosted) {
      const eventCost = Number(event.cost);
      const eventWallet = (await walletRepositories.walletRepositories.getOne({
        ownerId: event.id,
      })) as unknown as WalletAttributes;

      for (const attendee of attendees) {
        const attendeeWallet =
          (await walletRepositories.walletRepositories.getOne({
            ownerId: attendee.userId,
          })) as unknown as WalletAttributes;
        if (!attendeeWallet) {
          console.warn(`Wallet not found for attendee: ${attendee.userId}`);
          continue;
        }

        const transactionReference =
          generalHelpers.generateTransactionReference(event.eventTitle);

        const operations = [
          async (transaction: Transaction) => {
            await walletRepositories.walletRepositories.updateOne(
              { id: attendeeWallet.id },
              { ledgerBalance: attendeeWallet.ledgerBalance + eventCost },
              transaction
            );
          },
          async (transaction: Transaction) => {
            await transactionRepositories.transactionRepositories.create(
              {
                id: v4(),
                userUUId: attendee.userId,
                amount: eventCost,
                type: "credit",
                status: "completed",
                date: new Date(),
                reference: transactionReference,
                userEventyzzeId: attendee.eventyzzeId,
                description: `Refund from ${event.eventTitle} cancellation`,
              },
              transaction
            );
          },
          async (transaction: Transaction) => {
            await walletRepositories.walletRepositories.updateOne(
              { id: eventWallet.id },
              { ledgerBalance: eventWallet.ledgerBalance - eventCost },
              transaction
            );
          },
        ];

        await performTransaction.performTransaction(operations);

        const transactionReceipt = recieptUtilities({
          reference: transactionReference,
          amount: eventCost,
          type: "credit",
          status: "completed",
          date: new Date(),
          userEventyzzeId: "",
          description: `Refund from ${event.eventTitle} cancellation`,
        });

        try {
          await mailUtilities.sendMail(
            attendee.email,
            transactionReceipt,
            "Transaction"
          );
        } catch (error: any) {
          console.log("delete event error:", error.message);
        }
      }

      await eventRepositories.eventRepositories.deleteOne({ id: eventId });
      responseHandler.message =
        "Event deleted and refunds processed successfully";
      responseHandler.statusCode = 200;
      return responseHandler;
    }

    await eventRepositories.eventRepositories.deleteOne({ id: eventId });
    responseHandler.message = "Event deleted successfully";
    responseHandler.statusCode = 200;
    return responseHandler;
  }
);

export default {
  getAllHostsService,
  hostCreatesEventService,
  hostgetsAllTheirEventsService,
  hostGetsSingleEventService,
  hostDeletesEvent,
};
