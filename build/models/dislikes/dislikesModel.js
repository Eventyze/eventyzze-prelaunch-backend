"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dislikes = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../configurations/database");
const usersModel_1 = __importDefault(require("../users/usersModel"));
const eventsModel_1 = __importDefault(require("../events/eventsModel"));
class Dislikes extends sequelize_1.Model {
}
exports.Dislikes = Dislikes;
Dislikes.init({
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
    },
    eventId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: eventsModel_1.default,
            key: "id",
        },
        onDelete: "CASCADE",
    },
}, {
    sequelize: database_1.database,
    tableName: "Dislikes",
});
exports.default = Dislikes;
