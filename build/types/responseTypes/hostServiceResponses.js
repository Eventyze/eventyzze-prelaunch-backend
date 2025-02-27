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
})(HostServiceResponses || (exports.HostServiceResponses = HostServiceResponses = {}));
