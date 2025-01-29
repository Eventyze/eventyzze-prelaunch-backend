"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../configurations/database");
const usersModel_1 = __importDefault(require("../users/usersModel"));
const eventsModel_1 = __importDefault(require("../events/eventsModel"));
class Payment extends sequelize_1.Model {
}
exports.Payment = Payment;
Payment.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
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
    eventId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: eventsModel_1.default,
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    amount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("pending", "completed", "failed"),
        allowNull: false,
        defaultValue: "pending",
    },
    paymentMethod: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, // E.g., "credit_card", "bank_transfer", "paypal"
    },
    transactionId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, // Store transaction reference from payment gateway
        unique: true,
    },
    paidAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: database_1.database,
    tableName: "Payments",
});
exports.default = Payment;
