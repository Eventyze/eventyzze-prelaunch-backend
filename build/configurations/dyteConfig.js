"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const envKeys_1 = require("./envKeys");
const axiosInstance = axios_1.default.create({
    baseURL: envKeys_1.DYTE_BASE_URL,
    // headers: {
    // //   "Authorization": `Basic ${credentials}`,
    //   "Content-Type": "application/json",
    // },
    auth: {
        username: envKeys_1.DYTE_ORGANIZATION_ID,
        password: envKeys_1.DYTE_API_KEY
    }
});
axiosInstance.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});
axiosInstance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return Promise.reject(error);
});
exports.default = axiosInstance;
