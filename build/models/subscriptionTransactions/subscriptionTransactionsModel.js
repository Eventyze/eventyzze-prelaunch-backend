"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionTransaction = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../configurations/database");
const usersModel_1 = __importDefault(require("../users/usersModel"));
const subscriptionPlanModel_1 = require("../subscriptionPlan/subscriptionPlanModel");
class SubscriptionTransaction extends sequelize_1.Model {
}
exports.SubscriptionTransaction = SubscriptionTransaction;
SubscriptionTransaction.init({
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
    subscriptionPlanId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: subscriptionPlanModel_1.DatabaseSubscriptionPlans,
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    amount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("pending", "completed", "failed"),
        allowNull: false,
        defaultValue: "pending",
    },
    paymentMethod: {
        type: sequelize_1.DataTypes.ENUM("credit_card", "bank_transfer", "wallet", "paypal"),
        allowNull: false,
    },
    reference: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    autoRenew: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    dateOfPayment: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    dateOfExpiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: database_1.database,
    tableName: "SubscriptionTransaction",
});
exports.default = SubscriptionTransaction;
