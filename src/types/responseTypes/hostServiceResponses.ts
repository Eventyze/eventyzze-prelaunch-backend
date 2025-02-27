

export enum HostServiceResponses {
    UNABLE_TO_FETCH = "Unable to get hosts",
    SUCCESSFUL_FETCH = "Hosts fetched successfully",
    NOT_FOUND = "User does not exist",
    UPGRADE_TO_HOST = "You cannot Host an event unless you upgrade to a host",
    EXPIRED_PLAN = "Plan has expired, please pay again or upgrade before you can host an event",
    UNABLE_TO_CREATE_EVENT = "Unable to create Event, please try again",
    SUCCESSFUL_CREATION = "Event created successfully",
    SUCCESSFUL = "Process Successful",
    EVENT_NOT_FOUND = "Event not found",
    UNABLE_TO_DELETE_UNOWNED_EVENT = "You cannot delete an event you did not create",
    UNABLE_TO_DELETE_LIVE_EVENT ="You cannot delete an event that is live. End the event first please",
    EVENT_DELETE_WITH_REFUNDS = "Event deleted and refunds processed successfully",
    EVENT_DELETED_NO_REFUNDS = "Event deleted successfully"
}