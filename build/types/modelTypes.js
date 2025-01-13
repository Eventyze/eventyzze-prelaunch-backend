"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatus = exports.SubscriptionPlans = exports.Roles = void 0;
var Roles;
(function (Roles) {
    Roles["User"] = "User";
    Roles["Host"] = "Host";
    Roles["SuperAdmin"] = "SuperAdmin";
    Roles["FinanceAdmin"] = "FinanceAdmin";
    Roles["PeopleAdmin"] = "PeopleAdmin";
    Roles["ProcessAdmin"] = "ProcessAdmin";
})(Roles || (exports.Roles = Roles = {}));
var SubscriptionPlans;
(function (SubscriptionPlans) {
    SubscriptionPlans["Free"] = "Free";
    SubscriptionPlans["Bronze"] = "Bronze";
    SubscriptionPlans["Silver"] = "Silver";
    SubscriptionPlans["Gold"] = "Gold";
    SubscriptionPlans["Platinum"] = "Platinum";
})(SubscriptionPlans || (exports.SubscriptionPlans = SubscriptionPlans = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["Active"] = "Active";
    AccountStatus["Frozen"] = "Frozen";
    AccountStatus["Deactivated"] = "Deactivated";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
