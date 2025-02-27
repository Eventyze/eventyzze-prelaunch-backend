

export enum HostServiceResponses {
    UNABLE_TO_FETCH = "Unable to get hosts",
    SUCCESSFUL_FETCH = "Hosts fetched successfully",
    NOT_FOUND = "User does not exist",
    UPGRADE_TO_HOST = "You cannot Host an event unless you upgrade to a host",
    EXPIRED_PLAN = "Plan has expired, please pay again or upgrade before you can host an event",
    UNABLE_TO_CREATE_EVENT = "Unable to create Event, please try again",
    SUCCESSFUL_CREATION = "Event created successfully"
}