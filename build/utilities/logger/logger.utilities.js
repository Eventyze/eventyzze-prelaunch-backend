"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json());
const logger = winston_1.default.createLogger({
    format: logFormat,
    transports: [
        // Write all logs with importance level of 'error' or less to error.log
        new winston_1.default.transports.File({
            filename: path_1.default.join(__dirname, '../../../logs/error.log'),
            level: 'error'
        }),
        // Write all logs with importance level of 'info' or less to combined.log
        new winston_1.default.transports.File({
            filename: path_1.default.join(__dirname, '../../../logs/combined.log')
        }),
    ],
});
exports.logger = logger;
// If we're not in production then log to the console as well
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple()),
    }));
}
