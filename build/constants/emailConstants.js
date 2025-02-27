"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuthMailMessages = exports.EmailAuthMailSubjects = void 0;
var EmailAuthMailSubjects;
(function (EmailAuthMailSubjects) {
    EmailAuthMailSubjects["OTP"] = "Eventyzze OTP";
    EmailAuthMailSubjects["WELCOME"] = "Welcome to Eventyzze";
    EmailAuthMailSubjects["ACCOUNT"] = "Account Verification";
})(EmailAuthMailSubjects || (exports.EmailAuthMailSubjects = EmailAuthMailSubjects = {}));
const generateAuthMailMessages = () => {
    return {
        OTP: (otp) => {
            return `Welcome to Eventyzze, your OTP is ${otp}, it expires in 5 minutes`;
        },
        WELCOME: (name) => {
            return `Welcome to Eventyzze, ${name}. We are excited to have you on board.`;
        },
        ACCOUNT: (name) => {
            return `Hi ${name}, your account has been verified successfully.`;
        }
    };
};
exports.generateAuthMailMessages = generateAuthMailMessages;
