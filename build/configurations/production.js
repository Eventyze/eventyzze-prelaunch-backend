"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { PROD_PORT, PROD_NEON_DB_URL } = process.env;
console.log('Running in production mode');
exports.default = {
    PORT: PROD_PORT,
    NEON: PROD_NEON_DB_URL
};
