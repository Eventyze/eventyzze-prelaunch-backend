"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../configurations/database");
const modelTypes_1 = require("../../types/modelTypes");
class Wallet extends sequelize_1.Model {
}
exports.Wallet = Wallet;
Wallet.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    ownerId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    walletType: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(modelTypes_1.Roles)),
        allowNull: false,
        validate: {
            isIn: [Object.values(modelTypes_1.Roles)],
        },
    },
    totalBalance: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    ledgerBalance: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
}, {
    sequelize: database_1.database,
    tableName: "Wallet",
});
exports.default = Wallet;
