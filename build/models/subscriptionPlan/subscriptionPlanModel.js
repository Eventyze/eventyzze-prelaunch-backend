"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSubscriptionPlans = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../configurations/database");
class DatabaseSubscriptionPlans extends sequelize_1.Model {
}
exports.DatabaseSubscriptionPlans = DatabaseSubscriptionPlans;
DatabaseSubscriptionPlans.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    permissions: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
    },
    attendeeLimit: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    streamingLimitHours: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
}, {
    sequelize: database_1.database,
    tableName: "Subscription",
});
