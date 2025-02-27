"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MailSubjects;
(function (MailSubjects) {
    MailSubjects["OTP"] = "Eventyzze OTP";
    MailSubjects["WELCOME"] = "Welcome to Eventyzze";
    MailSubjects["ACCOUNT"] = "Account Verification";
    MailSubjects["LOGIN_ACTIVITY"] = "Activity Detected on Your Account";
    MailSubjects["EVENT_CREATION"] = "Eventyzze Event Creation";
    MailSubjects["TRANSACTION"] = "Transaction";
    MailSubjects["PASSWORD_RESET_REQUEST"] = "Password Reset Request";
    MailSubjects["SUCCESSFUL_PASSWORD_RESET"] = "Password Reset Successful";
})(MailSubjects || (MailSubjects = {}));
const generateMessages = () => {
    return {
        OTP: (otp) => {
            return `Welcome to Eventyzze, your OTP is ${otp}, it expires in 5 minutes`;
        },
        WELCOME: (name) => {
            return `Welcome to Eventyzze, ${name}. We are excited to have you on board.`;
        },
        ACCOUNT_VERIFIED: () => {
            return `Welcome to Eventyzze, your email has been verified successfully. You can now login and start hosting your events 😊`;
        },
        NEW_USER_LOGIN: () => {
            return `<br /><br />

          We're excited to have you on board. Eventyzze is your go-to platform for discovering, organizing, and sharing amazing events. Whether you're attending or hosting, we're here to make your experience seamless and enjoyable. <br /> <br />

          If you have any questions or need help getting started, feel free to reach out to our support team. We're always here to assist you. <br /> <br />

          Let's make some unforgettable moments together!`;
        },
        EXISTING_USER_LOGIN: (fullName, date, time) => {
            return `Hi ${fullName ? fullName : ""},
      There was a login to your account on ${date} by ${time}.<br /><br /> If you did not initiate this login, contact our support team to restrict your account. If it was you, please ignore.`;
        },
        EVENT_CREATION: (userName) => {
            return `Hello ${userName}, your event has been created, please do not forget to join on the selected date`;
        },
        REFUND_TRANSACTION_DESCRIPTION: (event_title) => {
            return `Refund from ${event_title} cancellation`;
        },
        PASSWORD_RESET_OTP: (otp) => {
            return `Your password reset OTP is ${otp}. It expires in 5 minutes.`;
        },
        PASSWORD_RESET_SUCCESSFUL: () => {
            return `Your password has been reset successfully.`;
        },
        FIRST_PROFILE_UPDATE_SUCCESSFUL: (fullName) => {
            return `Welcome to Eventyzze ${fullName ? fullName : ""}! <br /><br />

          We're excited to have you on board. Eventyzze is your go-to platform for discovering, organizing, and sharing amazing events. Whether you're attending or hosting, we're here to make your experience seamless and enjoyable. <br /> <br />

          If you have any questions or need help getting started, feel free to reach out to our support team. We're always here to assist you. <br /> <br />

          Let's make some unforgettable moments together!`;
        },
    };
};
exports.default = {
    MailSubjects,
    generateMessages,
};
