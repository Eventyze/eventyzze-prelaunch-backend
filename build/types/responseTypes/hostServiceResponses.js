"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostServiceResponses = void 0;
var HostServiceResponses;
(function (HostServiceResponses) {
    HostServiceResponses["UNABLE_TO_FETCH"] = "Unable to get hosts";
    HostServiceResponses["SUCCESSFUL_FETCH"] = "Hosts fetched successfully";
    HostServiceResponses["NOT_FOUND"] = "User does not exist";
    HostServiceResponses["UPGRADE_TO_HOST"] = "You cannot Host an event unless you upgrade to a host";
    HostServiceResponses["EXPIRED_PLAN"] = "Plan has expired, please pay again or upgrade before you can host an event";
    HostServiceResponses["UNABLE_TO_CREATE_EVENT"] = "Unable to create Event, please try again";
    HostServiceResponses["SUCCESSFUL_CREATION"] = "Event created successfully";
    HostServiceResponses["SUCCESSFUL"] = "Process Successful";
    HostServiceResponses["EVENT_NOT_FOUND"] = "Event not found";
    HostServiceResponses["UNABLE_TO_DELETE_UNOWNED_EVENT"] = "You cannot delete an event you did not create";
    HostServiceResponses["UNABLE_TO_DELETE_LIVE_EVENT"] = "You cannot delete an event that is live. End the event first please";
    HostServiceResponses["EVENT_DELETE_WITH_REFUNDS"] = "Event deleted and refunds processed successfully";
    HostServiceResponses["EVENT_DELETED_NO_REFUNDS"] = "Event deleted successfully";
})(HostServiceResponses || (exports.HostServiceResponses = HostServiceResponses = {}));
