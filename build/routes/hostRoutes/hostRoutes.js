"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorization_middleware_1 = require("../../middlewares/authorization.middleware");
const controllers_1 = require("../../controllers");
const utilities_1 = require("../../utilities");
const router = express_1.default.Router();
//Shop Routes
router.get('/get-all-hosts', controllers_1.hostController.allHosts);
router.post('/create-event', authorization_middleware_1.generalAuthFunction, utilities_1.cloudinaryUpload, controllers_1.hostController.hostCreatesEvent);
exports.default = router;
