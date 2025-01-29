"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transactions = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../configurations/database");
const usersModel_1 = __importDefault(require("../users/usersModel"));
class Transactions extends sequelize_1.Model {
}
exports.Transactions = Transactions;
Transactions.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    userUUId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: usersModel_1.default,
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    userEventyzzeId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM("credit", "debit"),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("pending", "completed", "failed"),
        allowNull: false,
        defaultValue: "pending",
    },
    reference: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.database,
    tableName: "Transactions",
});
