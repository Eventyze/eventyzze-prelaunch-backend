"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { DEV_PORT, DEV_NEON_DB_URL } = process.env;
console.log('Running in development mode');
exports.default = {
    PORT: DEV_PORT,
    NEON: DEV_NEON_DB_URL
};
