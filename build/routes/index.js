"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes/userRoutes"));
const hostRoutes_1 = __importDefault(require("./hostRoutes/hostRoutes"));
const adminRoutes_1 = __importDefault(require("./adminRoutes/adminRoutes"));
const rootRouter = (0, express_1.Router)();
rootRouter.use('/users', userRoutes_1.default);
rootRouter.use('/host', hostRoutes_1.default);
rootRouter.use('/admin', adminRoutes_1.default);
exports.default = rootRouter;
