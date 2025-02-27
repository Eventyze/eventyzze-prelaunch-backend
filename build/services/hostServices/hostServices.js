"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../../utilities");
const modelTypes_1 = require("../../types/modelTypes");
const repositories_1 = require("../../repositories");
const dayjs_1 = __importDefault(require("dayjs"));
const uuid_1 = require("uuid");
const helpers_1 = require("../../helpers");
const databaseTransactions_middleware_1 = __importDefault(require("../../middlewares/databaseTransactions.middleware"));
const services_1 = require("../../services");
const response_utilities_1 = __importDefault(require("../../utilities/responseHandlers/response.utilities"));
const constants_1 = require("../../constants");
const hostServiceResponses_1 = require("../../types/responseTypes/hostServiceResponses");
const getAllHostsService = utilities_1.errorUtilities.withErrorHandling(async () => {
    const projection = [
        constants_1.DatabaseConstants.DatabaseProjection.ID,
        constants_1.DatabaseConstants.DatabaseProjection.FULL_NAME,
        constants_1.DatabaseConstants.DatabaseProjection.USERNAME,
        constants_1.DatabaseConstants.DatabaseProjection.HOSTED_EVENTS,
        constants_1.DatabaseConstants.DatabaseProjection.ATTENDED_EVENTS,
        constants_1.DatabaseConstants.DatabaseProjection.USERIMAGE,
        constants_1.DatabaseConstants.DatabaseProjection.NO_OF_FOLLOWERS,
        constants_1.DatabaseConstants.DatabaseProjection.NEWLY_UPGRADED,
        constants_1.DatabaseConstants.DatabaseProjection.PHONE_NUMBER,
        constants_1.DatabaseConstants.DatabaseProjection.EVENTYZZE_ID,
        constants_1.DatabaseConstants.DatabaseProjection.EMAIL,
        constants_1.DatabaseConstants.DatabaseProjection.ROLE
    ];
    const hosts = await repositories_1.userRepositories.userRepositories.getMany({
    // role: Roles.Host 
    }, projection, [
        [constants_1.DatabaseConstants.DatabaseProjection.NEWLY_UPGRADED, constants_1.DatabaseConstants.DatabaseCadre.DESC],
        [constants_1.DatabaseConstants.DatabaseProjection.CREATED_AT, constants_1.DatabaseConstants.DatabaseCadre.DESC],
    ]);
    if (!hosts) {
        throw utilities_1.errorUtilities.createError(hostServiceResponses_1.HostServiceResponses.UNABLE_TO_FETCH, constants_1.StatusCodes.StatusCodes.NOT_FOUND);
    }
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, hostServiceResponses_1.HostServiceResponses.SUCCESSFUL_FETCH, hosts);
});
const hostCreatesEventService = utilities_1.errorUtilities.withErrorHandling(async (userId, eventCreationDetails) => {
    const projection = [
        constants_1.DatabaseConstants.DatabaseProjection.ID,
        constants_1.DatabaseConstants.DatabaseProjection.ROLE,
        constants_1.DatabaseConstants.DatabaseProjection.FULL_NAME,
        constants_1.DatabaseConstants.DatabaseProjection.USERNAME,
        constants_1.DatabaseConstants.DatabaseProjection.HOSTED_EVENTS,
        constants_1.DatabaseConstants.DatabaseProjection.ATTENDED_EVENTS,
        constants_1.DatabaseConstants.DatabaseProjection.USERIMAGE,
        constants_1.DatabaseConstants.DatabaseProjection.NO_OF_FOLLOWERS,
        constants_1.DatabaseConstants.DatabaseProjection.SUBSCRIPTION_PLAN,
        constants_1.DatabaseConstants.DatabaseProjection.SUBSCRIPTION_DETAILS,
        constants_1.DatabaseConstants.DatabaseProjection.EMAIL,
    ];
    const user = (await repositories_1.userRepositories.userRepositories.getOne({ id: userId }, projection));
    if (!user) {
        throw utilities_1.errorUtilities.createError(hostServiceResponses_1.HostServiceResponses.NOT_FOUND, constants_1.StatusCodes.StatusCodes.NOT_FOUND);
    }
    if (user.role === modelTypes_1.Roles.User && user.isInitialHostingOfferExhausted) {
        throw utilities_1.errorUtilities.createError(hostServiceResponses_1.HostServiceResponses.UPGRADE_TO_HOST, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
    }
    if (user.subscriptionPlan !== modelTypes_1.SubscriptionPlans.Free &&
        new Date(user.subscriptionDetails?.dateOfExpiry) >= new Date()) {
        throw utilities_1.errorUtilities.createError(hostServiceResponses_1.HostServiceResponses.EXPIRED_PLAN, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
    }
    if (user.subscriptionDetails.type === modelTypes_1.SubscriptionPlans.Free &&
        user.subscriptionDetails.hasPaid === false) {
        throw utilities_1.errorUtilities.createError(hostServiceResponses_1.HostServiceResponses.UPGRADE_TO_HOST, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
    }
    let userDyteData;
    if (user.subscriptionDetails.type === modelTypes_1.SubscriptionPlans.Free ||
        user.subscriptionDetails.type === modelTypes_1.SubscriptionPlans.Bronze) {
        userDyteData = helpers_1.dyteHelpers.bronzeUserDataGenerator(eventCreationDetails.eventTitle, eventCreationDetails.preferredRegion);
    }
    else if (user.subscriptionDetails.type === modelTypes_1.SubscriptionPlans.Silver) {
        userDyteData = helpers_1.dyteHelpers.silverUserDataGenerator(eventCreationDetails.eventTitle, eventCreationDetails.preferredRegion);
    }
    else if (user.subscriptionDetails.type === modelTypes_1.SubscriptionPlans.Gold) {
        userDyteData = helpers_1.dyteHelpers.goldUserDataGenerator(eventCreationDetails.eventTitle, eventCreationDetails.preferredRegion, eventCreationDetails.duration);
    }
    else if (user.subscriptionDetails.type === modelTypes_1.SubscriptionPlans.Platinum) {
        userDyteData = helpers_1.dyteHelpers.platinumUserDataGenerator(eventCreationDetails.eventTitle, eventCreationDetails.preferredRegion, eventCreationDetails.duration);
    }
    const dyteMeetingData = await services_1.dyteServices.createDyteMeeting(userDyteData);
    const eventId = (0, uuid_1.v4)();
    const formattedDate = (0, dayjs_1.default)(eventCreationDetails.date).format("YYYY-MM-DD");
    const endTime = helpers_1.generalHelpers.calculateEndTime(eventCreationDetails.startTime, eventCreationDetails.duration, formattedDate);
    const eventPayload = {
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
        dyteDetails: {
            meetingId: dyteMeetingData.data.id,
            meetingTitle: dyteMeetingData.data.title,
            createdAt: dyteMeetingData.data.created_at,
            updatedAt: dyteMeetingData.data.updated_at,
        },
    };
    const eventWalletPayload = {
        id: (0, uuid_1.v4)(),
        ownerId: eventId,
        walletType: modelTypes_1.Roles.Event,
        totalBalance: 0,
    };
    const createEvent = await repositories_1.eventRepositories.eventRepositories.create(eventPayload);
    if (!createEvent)
        throw utilities_1.errorUtilities.createError(hostServiceResponses_1.HostServiceResponses.UNABLE_TO_CREATE_EVENT, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
    const EventWallet = await repositories_1.walletRepositories.walletRepositories.create(eventWalletPayload);
    if (!EventWallet)
        throw utilities_1.errorUtilities.createError(hostServiceResponses_1.HostServiceResponses.UNABLE_TO_CREATE_EVENT, constants_1.StatusCodes.StatusCodes.BAD_REQUEST);
    const newEvent = await repositories_1.eventRepositories.eventRepositories.getOne({
        id: eventId,
    });
    await utilities_1.mailUtilities.sendMail(user.email, constants_1.EmailConstants.generateMessages().EVENT_CREATION(user.userName), constants_1.EmailConstants.MailSubjects.EVENT_CREATION);
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.CREATED, hostServiceResponses_1.HostServiceResponses.SUCCESSFUL_CREATION, newEvent);
});
const hostgetsAllTheirEventsService = utilities_1.errorUtilities.withErrorHandling(async (userId) => {
    const user = await repositories_1.userRepositories.userRepositories.getOne({ id: userId });
    if (!user) {
        return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.NOT_FOUND, hostServiceResponses_1.HostServiceResponses.NOT_FOUND);
    }
    const userEvents = await repositories_1.eventRepositories.eventRepositories.getMany({
        userId,
    });
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, hostServiceResponses_1.HostServiceResponses.SUCCESSFUL, { events: userEvents });
});
const hostGetsSingleEventService = utilities_1.errorUtilities.withErrorHandling(async (userId, eventId) => {
    const user = await repositories_1.userRepositories.userRepositories.getOne({ id: userId });
    if (!user) {
        return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.NOT_FOUND, hostServiceResponses_1.HostServiceResponses.NOT_FOUND);
    }
    const singleEvent = await repositories_1.eventRepositories.eventRepositories.getOne({
        userId,
    });
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, hostServiceResponses_1.HostServiceResponses.SUCCESSFUL, { event: singleEvent });
});
const hostDeletesEvent = utilities_1.errorUtilities.withErrorHandling(async (userId, eventId) => {
    const user = await repositories_1.userRepositories.userRepositories.getOne({ id: userId });
    if (!user) {
        return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.NOT_FOUND, hostServiceResponses_1.HostServiceResponses.NOT_FOUND);
    }
    const event = (await repositories_1.eventRepositories.eventRepositories.getOne({
        id: eventId,
    }));
    if (!event) {
        return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.NOT_FOUND, hostServiceResponses_1.HostServiceResponses.EVENT_NOT_FOUND);
    }
    if (event.userId !== userId) {
        return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.BAD_REQUEST, hostServiceResponses_1.HostServiceResponses.UNABLE_TO_DELETE_UNOWNED_EVENT);
    }
    if (event.isLive) {
        return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.BAD_REQUEST, hostServiceResponses_1.HostServiceResponses.UNABLE_TO_DELETE_LIVE_EVENT);
    }
    const attendees = (await repositories_1.attendanceRepositories.attendanceRepositories.getMany({
        eventId,
    }));
    if (attendees.length && !event.isHosted) {
        const eventCost = Number(event.cost);
        const eventWallet = (await repositories_1.walletRepositories.walletRepositories.getOne({
            ownerId: event.id,
        }));
        for (const attendee of attendees) {
            const attendeeWallet = (await repositories_1.walletRepositories.walletRepositories.getOne({
                ownerId: attendee.userId,
            }));
            if (!attendeeWallet) {
                console.warn(`Wallet not found for attendee: ${attendee.userId}`);
                continue;
            }
            const transactionReference = helpers_1.generalHelpers.generateTransactionReference(event.eventTitle);
            const operations = [
                async (transaction) => {
                    await repositories_1.walletRepositories.walletRepositories.updateOne({ id: attendeeWallet.id }, { ledgerBalance: attendeeWallet.ledgerBalance + eventCost }, transaction);
                },
                async (transaction) => {
                    await repositories_1.transactionRepositories.transactionRepositories.create({
                        id: (0, uuid_1.v4)(),
                        userUUId: attendee.userId,
                        amount: eventCost,
                        type: constants_1.TransactionConstants.TransactionType.CREDIT,
                        status: constants_1.TransactionConstants.TransactionStatus.COMPLETED,
                        date: new Date(),
                        reference: transactionReference,
                        userEventyzzeId: attendee.eventyzzeId,
                        description: constants_1.EmailConstants.generateMessages().REFUND_TRANSACTION_DESCRIPTION(event.eventTitle),
                    }, transaction);
                },
                async (transaction) => {
                    await repositories_1.walletRepositories.walletRepositories.updateOne({ id: eventWallet.id }, { ledgerBalance: eventWallet.ledgerBalance - eventCost }, transaction);
                },
            ];
            await databaseTransactions_middleware_1.default.performTransaction(operations);
            const transactionReceipt = (0, utilities_1.recieptUtilities)({
                reference: transactionReference,
                amount: eventCost,
                type: constants_1.TransactionConstants.TransactionType.CREDIT,
                status: constants_1.TransactionConstants.TransactionStatus.COMPLETED,
                date: new Date(),
                userEventyzzeId: "",
                description: constants_1.EmailConstants.generateMessages().REFUND_TRANSACTION_DESCRIPTION(event.eventTitle),
            });
            try {
                await utilities_1.mailUtilities.sendMail(attendee.email, transactionReceipt, constants_1.EmailConstants.MailSubjects.TRANSACTION);
            }
            catch (error) {
                console.log("delete event error:", error.message);
            }
        }
        await repositories_1.eventRepositories.eventRepositories.deleteOne({ id: eventId });
        return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, hostServiceResponses_1.HostServiceResponses.EVENT_DELETE_WITH_REFUNDS);
    }
    await repositories_1.eventRepositories.eventRepositories.deleteOne({ id: eventId });
    return response_utilities_1.default.handleServicesResponse(constants_1.StatusCodes.StatusCodes.OK, hostServiceResponses_1.HostServiceResponses.EVENT_DELETED_NO_REFUNDS);
});
exports.default = {
    getAllHostsService,
    hostCreatesEventService,
    hostgetsAllTheirEventsService,
    hostGetsSingleEventService,
    hostDeletesEvent,
};
