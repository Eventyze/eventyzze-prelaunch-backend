"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Followings = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../configurations/database");
const usersModel_1 = __importDefault(require("../users/usersModel"));
class Followings extends sequelize_1.Model {
}
exports.Followings = Followings;
Followings.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: usersModel_1.default,
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    followings: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
    },
}, {
    sequelize: database_1.database,
    tableName: "Followings",
});
exports.default = Followings;
