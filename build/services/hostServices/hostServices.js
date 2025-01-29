"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../../utilities");
const modelTypes_1 = require("../../types/modelTypes");
const repositories_1 = require("../../repositories");
const uuid_1 = require("uuid");
const helpers_1 = require("../../helpers");
const databaseTransactions_middleware_1 = __importDefault(require("../../middlewares/databaseTransactions.middleware"));
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
        "noOfFollowers"
    ];
    const hosts = await repositories_1.userRepositories.userRepositories.getMany({ role: modelTypes_1.Roles.Host }, projection);
    if (!hosts || hosts.length === 0) {
        responseHandler.statusCode = 404;
        responseHandler.message = "No hosts found";
        responseHandler.data = {
            hosts
        };
        return responseHandler;
    }
    responseHandler.statusCode = 200;
    responseHandler.message = "Profile updated successfully";
    responseHandler.data = {
        hosts
    };
    return responseHandler;
});
const hostCreatesEventService = utilities_1.errorUtilities.withErrorHandling(async (userId, eventCreationDetails) => {
    const responseHandler = {
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
    ];
    const user = await repositories_1.userRepositories.userRepositories.getOne({ id: userId }, projection);
    if (!user) {
        responseHandler.message = "User does not exist";
        responseHandler.statusCode = 404;
        return responseHandler;
    }
    if (user.role === modelTypes_1.Roles.User && user.isInitialHostingOfferExhausted) {
        responseHandler.message = "You cannot Host an event unless you upgrade to a host";
        responseHandler.statusCode = 400;
        return responseHandler;
    }
    if (user.subscriptionDetails.type === modelTypes_1.SubscriptionPlans.Free) {
        responseHandler.message = "You cannot Host an event unless you upgrade to a host";
        responseHandler.statusCode = 400;
        return responseHandler;
    }
    if (!user.subscriptionDetails.hasPaid) {
        responseHandler.message = "Plan has expired, please pay again or upgrade before you can host an event";
        responseHandler.statusCode = 400;
        return responseHandler;
    }
    const eventId = (0, uuid_1.v4)();
    const eventPayload = {
        id: eventId,
        userId: user.id,
        eventTitle: eventCreationDetails.eventTitle,
        description: eventCreationDetails.description,
        eventAd: eventCreationDetails.eventAd,
        date: eventCreationDetails.date,
        startTime: eventCreationDetails.startTime,
        duration: eventCreationDetails.duration,
        endTime: eventCreationDetails.endTime,
        cost: eventCreationDetails.cost,
        coverImage: eventCreationDetails.coverImage,
        noOfLikes: 0,
        noOfDislikes: 0
    };
    const eventWalletPayload = {
        id: (0, uuid_1.v4)(),
        ownerId: eventId,
        walletType: modelTypes_1.Roles.Event,
        totalBalance: 0,
    };
    const operations = [
        async (transaction) => {
            await repositories_1.eventRepositories.eventRepositories.create(eventPayload, transaction);
        },
        async (transaction) => {
            await repositories_1.walletRepositories.walletRepositories.create(eventWalletPayload, transaction);
        },
    ];
    await databaseTransactions_middleware_1.default.performTransaction(operations);
    await utilities_1.mailUtilities.sendMail(user.email, `Hello ${user.userName}, your event has been created, please do not forget to join on the selected date`, "Eventyzze Event Creation");
    responseHandler.statusCode = 201;
    responseHandler.message = "Event created successfully";
    responseHandler.data = user;
    return responseHandler;
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
        responseHandler.message = 'User not found';
        responseHandler.statusCode = 404;
        return responseHandler;
    }
    const userEvents = await repositories_1.eventRepositories.eventRepositories.getMany({ userId });
    responseHandler.message = 'Events fetched successfully';
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
        responseHandler.message = 'User not found';
        responseHandler.statusCode = 404;
        return responseHandler;
    }
    const singleEvent = await repositories_1.eventRepositories.eventRepositories.getOne({ userId });
    responseHandler.message = 'Event fetched successfully';
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
    const event = await repositories_1.eventRepositories.eventRepositories.getOne({ id: eventId });
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
    if (event.isHosting) {
        responseHandler.message = "You cannot delete an event that is still ongoing. End the event first please";
        responseHandler.statusCode = 400;
        return responseHandler;
    }
    const attendees = await repositories_1.attendanceRepositories.attendanceRepositories.getMany({ eventId });
    if (attendees.length && !event.isHosted) {
        const eventCost = event.cost;
        const eventWallet = await repositories_1.walletRepositories.walletRepositories.getOne({ ownerId: event.id });
        for (const attendee of attendees) {
            const attendeeWallet = await repositories_1.walletRepositories.walletRepositories.getOne({ ownerId: attendee.userId });
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
        responseHandler.message = "Event deleted and refunds processed successfully";
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
    hostDeletesEvent
};
