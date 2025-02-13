"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("./config"));
const { NEON } = config_1.default;
exports.database = new sequelize_1.Sequelize(`${NEON}`, {
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
// let sequelize: Sequelize;
// export const getDatabase = () => {
//   if (!sequelize) {
//     sequelize = new Sequelize(`${NEON}`, {
//       pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000,
//       },
//     });
//   }
//   return sequelize;
// };
