"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flutterServices = exports.paymentServices = exports.walletServices = exports.adminService = exports.dyteServices = exports.passwordResetService = exports.facebookAuthService = exports.googleAuthService = exports.hostServices = exports.userServices = exports.userEmailAuthService = void 0;
const emailAuth_1 = __importDefault(require("./authServices/emailAuth"));
exports.userEmailAuthService = emailAuth_1.default;
const userServices_1 = __importDefault(require("./userServices/userServices"));
exports.userServices = userServices_1.default;
const hostServices_1 = __importDefault(require("./hostServices/hostServices"));
exports.hostServices = hostServices_1.default;
const googleAuth_1 = __importDefault(require("./authServices/googleAuth"));
exports.googleAuthService = googleAuth_1.default;
const facebookAuth_1 = __importDefault(require("./authServices/facebookAuth"));
exports.facebookAuthService = facebookAuth_1.default;
const passwordReset_1 = __importDefault(require("./authServices/passwordReset"));
exports.passwordResetService = passwordReset_1.default;
const dyteServices_1 = __importDefault(require("./dyteServices/dyteServices"));
exports.dyteServices = dyteServices_1.default;
const adminService_1 = __importDefault(require("./adminServices/adminService"));
exports.adminService = adminService_1.default;
const walletServices_1 = __importDefault(require("./walletServices/walletServices"));
exports.walletServices = walletServices_1.default;
const paymentServices_1 = __importDefault(require("./paymentServices/paymentServices"));
exports.paymentServices = paymentServices_1.default;
const flutterServices_1 = __importDefault(require("./flutterWaveServices/flutterServices"));
exports.flutterServices = flutterServices_1.default;
