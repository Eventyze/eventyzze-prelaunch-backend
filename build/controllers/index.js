"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = exports.hostController = exports.userController = exports.userAuthController = void 0;
const userAuth_1 = __importDefault(require("./userAuth"));
exports.userAuthController = userAuth_1.default;
const user_1 = __importDefault(require("./user"));
exports.userController = user_1.default;
const host_1 = __importDefault(require("./host"));
exports.hostController = host_1.default;
const admin_1 = __importDefault(require("./admin"));
exports.adminController = admin_1.default;
