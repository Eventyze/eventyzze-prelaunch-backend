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
import dayjs from "dayjs";
import { v4 } from "uuid";
import { Transaction } from "sequelize";
import { dyteHelpers, generalHelpers } from "../../helpers";
import performTransaction from "../../middlewares/databaseTransactions.middleware";
import { dyteServices } from "../../services";
import handleServicesResponse from "../../utilities/responseHandlers/response.utilities";
import {
  DatabaseConstants,
  EmailConstants,
  StatusCodes,
  TransactionConstants,
} from "../../constants";
import { HostServiceResponses } from "../../types/responseTypes/hostServiceResponses";

const getAllHostsService = errorUtilities.withErrorHandling(
  async (): Promise<Record<string, any>> => {
    const projection = [
      DatabaseConstants.DatabaseProjection.ID,
      DatabaseConstants.DatabaseProjection.FULL_NAME,
      DatabaseConstants.DatabaseProjection.USERNAME,
      DatabaseConstants.DatabaseProjection.HOSTED_EVENTS,
      DatabaseConstants.DatabaseProjection.ATTENDED_EVENTS,
      DatabaseConstants.DatabaseProjection.USERIMAGE,
      DatabaseConstants.DatabaseProjection.NO_OF_FOLLOWERS,
      DatabaseConstants.DatabaseProjection.NEWLY_UPGRADED,
      DatabaseConstants.DatabaseProjection.PHONE_NUMBER,
      DatabaseConstants.DatabaseProjection.EVENTYZZE_ID,
      DatabaseConstants.DatabaseProjection.EMAIL,
      DatabaseConstants.DatabaseProjection.ROLE,
    ];

    const hosts: any = await userRepositories.userRepositories.getMany(
      {
        // role: Roles.Host
      },
      projection,
      [
        [
          DatabaseConstants.DatabaseProjection.NEWLY_UPGRADED,
          DatabaseConstants.DatabaseCadre.DESC,
        ],
        [
          DatabaseConstants.DatabaseProjection.CREATED_AT,
          DatabaseConstants.DatabaseCadre.DESC,
        ],
      ]
    );

    if (!hosts) {
      throw errorUtilities.createError(
        HostServiceResponses.UNABLE_TO_FETCH,
        StatusCodes.StatusCodes.NOT_FOUND
      );
    }
    return handleServicesResponse.handleServicesResponse(
      StatusCodes.StatusCodes.OK,
      HostServiceResponses.SUCCESSFUL_FETCH,
      hosts
    );
  }
);

const hostCreatesEventService = errorUtilities.withErrorHandling(
  async (
    userId: string,
    eventCreationDetails: Record<string, any>
  ): Promise<Record<string, any>> => {
    const projection = [
      DatabaseConstants.DatabaseProjection.ID,
      DatabaseConstants.DatabaseProjection.ROLE,
      DatabaseConstants.DatabaseProjection.FULL_NAME,
      DatabaseConstants.DatabaseProjection.USERNAME,
      DatabaseConstants.DatabaseProjection.HOSTED_EVENTS,
      DatabaseConstants.DatabaseProjection.ATTENDED_EVENTS,
      DatabaseConstants.DatabaseProjection.USERIMAGE,
      DatabaseConstants.DatabaseProjection.NO_OF_FOLLOWERS,
      DatabaseConstants.DatabaseProjection.SUBSCRIPTION_PLAN,
      DatabaseConstants.DatabaseProjection.SUBSCRIPTION_DETAILS,
      DatabaseConstants.DatabaseProjection.EMAIL,
    ];

    const user = (await userRepositories.userRepositories.getOne(
      { id: userId },
      projection
    )) as unknown as UserAttributes;

    if (!user) {
      throw errorUtilities.createError(
        HostServiceResponses.NOT_FOUND,
        StatusCodes.StatusCodes.NOT_FOUND
      );
    }

    if (user.role === Roles.User && user.isInitialHostingOfferExhausted) {
      throw errorUtilities.createError(
        HostServiceResponses.UPGRADE_TO_HOST,
        StatusCodes.StatusCodes.BAD_REQUEST
      );
    }

    if (
      user.subscriptionPlan !== SubscriptionPlans.Free &&
      new Date(user.subscriptionDetails?.dateOfExpiry) >= new Date()
    ) {
      throw errorUtilities.createError(
        HostServiceResponses.EXPIRED_PLAN,
        StatusCodes.StatusCodes.BAD_REQUEST
      );
    }

    if (
      user.subscriptionDetails.type === SubscriptionPlans.Free &&
      user.subscriptionDetails.hasPaid === false
    ) {
      throw errorUtilities.createError(
        HostServiceResponses.UPGRADE_TO_HOST,
        StatusCodes.StatusCodes.BAD_REQUEST
      );
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

    const endTime = generalHelpers.calculateEndTime(
      eventCreationDetails.startTime,
      eventCreationDetails.duration,
      formattedDate
    );

    const eventPayload: Partial<EventAttributes> = {
      id: eventId,
      userId: user.id,
      eventTitle: eventCreationDetails.eventTitle.trim(),
      description: eventCreationDetails.description.trim(),
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
      category: eventCreationDetails.category,
      early_birds: eventCreationDetails.earlyBirdsStatus,
      early_birds_discount: eventCreationDetails.earlyBirdsCost,
      early_birds_end_date: eventCreationDetails.earlyBirdsDeadline,
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
        HostServiceResponses.UNABLE_TO_CREATE_EVENT,
        StatusCodes.StatusCodes.BAD_REQUEST
      );

    const EventWallet = await walletRepositories.walletRepositories.create(
      eventWalletPayload
    );

    if (!EventWallet)
      throw errorUtilities.createError(
        HostServiceResponses.UNABLE_TO_CREATE_EVENT,
        StatusCodes.StatusCodes.BAD_REQUEST
      );

    const newEvent = await eventRepositories.eventRepositories.getOne({
      id: eventId,
    });

    await mailUtilities.sendMail(
      user.email,
      EmailConstants.generateMessages().EVENT_CREATION(user.userName),
      EmailConstants.MailSubjects.EVENT_CREATION
    );

    return handleServicesResponse.handleServicesResponse(
      StatusCodes.StatusCodes.CREATED,
      HostServiceResponses.SUCCESSFUL_CREATION,
      newEvent
    );
  }
);

const hostgetsAllTheirEventsService = errorUtilities.withErrorHandling(
  async (userId: string): Promise<Record<string, any>> => {
    const user = await userRepositories.userRepositories.getOne({ id: userId });

    if (!user) {
      return handleServicesResponse.handleServicesResponse(
        StatusCodes.StatusCodes.NOT_FOUND,
        HostServiceResponses.NOT_FOUND
      );
    }

    const userEvents = await eventRepositories.eventRepositories.getMany({
      userId,
    });

    return handleServicesResponse.handleServicesResponse(
      StatusCodes.StatusCodes.OK,
      HostServiceResponses.SUCCESSFUL,
      { events: userEvents }
    );
  }
);

const hostGetsSingleEventService = errorUtilities.withErrorHandling(
  async (userId: string, eventId: string): Promise<Record<string, any>> => {
    const user = await userRepositories.userRepositories.getOne({ id: userId });

    if (!user) {
      return handleServicesResponse.handleServicesResponse(
        StatusCodes.StatusCodes.NOT_FOUND,
        HostServiceResponses.NOT_FOUND
      );
    }

    const singleEvent = await eventRepositories.eventRepositories.getOne({
      userId,
    });

    return handleServicesResponse.handleServicesResponse(
      StatusCodes.StatusCodes.OK,
      HostServiceResponses.SUCCESSFUL,
      { event: singleEvent }
    );
  }
);

const hostDeletesEvent = errorUtilities.withErrorHandling(
  async (userId: string, eventId: string): Promise<Record<string, any>> => {
    const user = await userRepositories.userRepositories.getOne({ id: userId });
    if (!user) {
      return handleServicesResponse.handleServicesResponse(
        StatusCodes.StatusCodes.NOT_FOUND,
        HostServiceResponses.NOT_FOUND
      );
    }

    const event = (await eventRepositories.eventRepositories.getOne({
      id: eventId,
    })) as unknown as EventAttributes;
    if (!event) {
      return handleServicesResponse.handleServicesResponse(
        StatusCodes.StatusCodes.NOT_FOUND,
        HostServiceResponses.EVENT_NOT_FOUND
      );
    }

    if (event.userId !== userId) {
      return handleServicesResponse.handleServicesResponse(
        StatusCodes.StatusCodes.BAD_REQUEST,
        HostServiceResponses.UNABLE_TO_DELETE_UNOWNED_EVENT
      );
    }

    if (event.isLive) {
      return handleServicesResponse.handleServicesResponse(
        StatusCodes.StatusCodes.BAD_REQUEST,
        HostServiceResponses.UNABLE_TO_DELETE_LIVE_EVENT
      );
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
                type: TransactionConstants.TransactionType.CREDIT,
                status: TransactionConstants.TransactionStatus.COMPLETED,
                date: new Date(),
                reference: transactionReference,
                userEventyzzeId: attendee.eventyzzeId,
                description:
                  EmailConstants.generateMessages().REFUND_TRANSACTION_DESCRIPTION(
                    event.eventTitle
                  ),
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
          type: TransactionConstants.TransactionType.CREDIT,
          status: TransactionConstants.TransactionStatus.COMPLETED,
          date: new Date(),
          userEventyzzeId: "",
          description:
            EmailConstants.generateMessages().REFUND_TRANSACTION_DESCRIPTION(
              event.eventTitle
            ),
        });

        try {
          await mailUtilities.sendMail(
            attendee.email,
            transactionReceipt,
            EmailConstants.MailSubjects.TRANSACTION
          );
        } catch (error: any) {
          console.log("delete event error:", error.message);
        }
      }

      await eventRepositories.eventRepositories.deleteOne({ id: eventId });
      return handleServicesResponse.handleServicesResponse(
        StatusCodes.StatusCodes.OK,
        HostServiceResponses.EVENT_DELETE_WITH_REFUNDS
      );
    }

    await eventRepositories.eventRepositories.deleteOne({ id: eventId });
    return handleServicesResponse.handleServicesResponse(
      StatusCodes.StatusCodes.OK,
      HostServiceResponses.EVENT_DELETED_NO_REFUNDS
    );
  }
);

export default {
  getAllHostsService,
  hostCreatesEventService,
  hostgetsAllTheirEventsService,
  hostGetsSingleEventService,
  hostDeletesEvent,
};
