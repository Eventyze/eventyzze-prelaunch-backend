"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const config_1 = __importDefault(require("./configurations/config"));
const utilities_1 = require("./utilities");
const database_1 = require("./configurations/database");
require("./models/associations");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
dotenv_1.default.config();
// Set security HTTP headers to disable 'powered by Express' header feature
app.disable("x-powered-by");
// Set security HTTP headers
app.use((0, helmet_1.default)());
// Parse urlencoded request body
app.use(express_1.default.urlencoded({ extended: true }));
// Compress response to increase speed
app.use((0, compression_1.default)());
// Set Cors
app.use((0, cors_1.default)());
//Other Middlewares
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Database
database_1.database
    .sync({})
    .then(() => {
    console.log("Database is connected");
})
    .catch((err) => {
    console.log("No connection:", err);
});
// Routes
app.use("/api/v1", routes_1.default);
// Health Check Endpoint
app.get("/", (request, response) => {
    response.send("Welcome to Eventyzze' Backend Server. 👋");
});
// Error handler
app.use(utilities_1.errorUtilities.globalErrorHandler);
/**
 * Server
 */
server.listen(config_1.default.PORT, () => {
    console.log(`server running on Port ${config_1.default.PORT}`);
});
exports.default = app;
