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
const getAllHostsService = utilities_1.errorUtilities.withErrorHandling(async () => {
    const responseHandler = {
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
    const hosts = await repositories_1.userRepositories.userRepositories.getMany({
    // role: Roles.Host 
    }, projection, [
        ['newlyUpgraded', 'DESC'],
        ['createdAt', 'DESC'],
    ]);
    if (!hosts) {
        throw utilities_1.errorUtilities.createError('Unable to get hosts', 404);
    }
    return response_utilities_1.default.handleServicesResponse(200, "Hosts fetched successfully", hosts);
});
const hostCreatesEventService = utilities_1.errorUtilities.withErrorHandling(async (userId, eventCreationDetails) => {
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
    const user = (await repositories_1.userRepositories.userRepositories.getOne({ id: userId }, projection));
    if (!user) {
        throw utilities_1.errorUtilities.createError("User does not exist", 404);
    }
    if (user.role === modelTypes_1.Roles.User && user.isInitialHostingOfferExhausted) {
        throw utilities_1.errorUtilities.createError("You cannot Host an event unless you upgrade to a host", 400);
    }
    if (user.subscriptionPlan !== modelTypes_1.SubscriptionPlans.Free &&
        new Date(user.subscriptionDetails?.dateOfExpiry) >= new Date()) {
        throw utilities_1.errorUtilities.createError("Plan has expired, please pay again or upgrade before you can host an event", 400);
    }
    if (user.subscriptionDetails.type === modelTypes_1.SubscriptionPlans.Free &&
        user.subscriptionDetails.hasPaid === false) {
        throw utilities_1.errorUtilities.createError("You cannot Host an event unless you upgrade to a host", 400);
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
        throw utilities_1.errorUtilities.createError("Unable to create Event, please try again", 400);
    const EventWallet = await repositories_1.walletRepositories.walletRepositories.create(eventWalletPayload);
    if (!EventWallet)
        throw utilities_1.errorUtilities.createError("Unable to create Event, please try again", 400);
    const newEvent = await repositories_1.eventRepositories.eventRepositories.getOne({
        id: eventId,
    });
    await utilities_1.mailUtilities.sendMail(user.email, `Hello ${user.userName}, your event has been created, please do not forget to join on the selected date`, "Eventyzze Event Creation");
    return response_utilities_1.default.handleServicesResponse(201, "Event created successfully", newEvent);
});
const hostgetsAllTheirEventsService = utilities_1.errorUtilities.withErrorHandling(async (userId) => {
    const responseHandler = {
        statusCode: 0,
        message: "",
        data: {},
        details: {},
        info: {},
    };
    const user = await repositories_1.userRepositories.userRepositories.getOne({ id: userId });
    if (!user) {
        responseHandler.message = "User not found";
        responseHandler.statusCode = 404;
        return responseHandler;
    }
    const userEvents = await repositories_1.eventRepositories.eventRepositories.getMany({
        userId,
    });
    responseHandler.message = "Events fetched successfully";
    responseHandler.statusCode = 200;
    responseHandler.data = { events: userEvents };
    return responseHandler;
});
const hostGetsSingleEventService = utilities_1.errorUtilities.withErrorHandling(async (userId, eventId) => {
    const responseHandler = {
        statusCode: 0,
        message: "",
        data: {},
        details: {},
        info: {},
    };
    const user = await repositories_1.userRepositories.userRepositories.getOne({ id: userId });
    if (!user) {
        responseHandler.message = "User not found";
        responseHandler.statusCode = 404;
        return responseHandler;
    }
    const singleEvent = await repositories_1.eventRepositories.eventRepositories.getOne({
        userId,
    });
    responseHandler.message = "Event fetched successfully";
    responseHandler.statusCode = 200;
    responseHandler.data = { event: singleEvent };
    return responseHandler;
});
const hostDeletesEvent = utilities_1.errorUtilities.withErrorHandling(async (userId, eventId) => {
    const responseHandler = {
        statusCode: 0,
        message: "",
        data: {},
        details: {},
        info: {},
    };
    const user = await repositories_1.userRepositories.userRepositories.getOne({ id: userId });
    if (!user) {
        responseHandler.message = "User not found";
        responseHandler.statusCode = 404;
        return responseHandler;
    }
    const event = (await repositories_1.eventRepositories.eventRepositories.getOne({
        id: eventId,
    }));
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
                        type: "credit",
                        status: "completed",
                        date: new Date(),
                        reference: transactionReference,
                        userEventyzzeId: attendee.eventyzzeId,
                        description: `Refund from ${event.eventTitle} cancellation`,
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
                type: "credit",
                status: "completed",
                date: new Date(),
                userEventyzzeId: "",
                description: `Refund from ${event.eventTitle} cancellation`,
            });
            try {
                await utilities_1.mailUtilities.sendMail(attendee.email, transactionReceipt, "Transaction");
            }
            catch (error) {
                console.log("delete event error:", error.message);
            }
        }
        await repositories_1.eventRepositories.eventRepositories.deleteOne({ id: eventId });
        responseHandler.message =
            "Event deleted and refunds processed successfully";
        responseHandler.statusCode = 200;
        return responseHandler;
    }
    await repositories_1.eventRepositories.eventRepositories.deleteOne({ id: eventId });
    responseHandler.message = "Event deleted successfully";
    responseHandler.statusCode = 200;
    return responseHandler;
});
exports.default = {
    getAllHostsService,
    hostCreatesEventService,
    hostgetsAllTheirEventsService,
    hostGetsSingleEventService,
    hostDeletesEvent,
};
