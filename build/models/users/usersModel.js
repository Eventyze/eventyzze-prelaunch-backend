"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../../configurations/database");
const modelTypes_1 = require("../../types/modelTypes");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    fullName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    userName: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        unique: {
            name: "unique_userName",
            msg: "Username already in use, please choose another",
        },
    },
    eventyzzeId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        unique: {
            name: "unique_email",
            msg: "Email already in use",
        },
    },
    activeDeviceId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    isInitialHostingOfferExhausted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(modelTypes_1.Roles)),
        allowNull: false,
        validate: {
            isIn: [Object.values(modelTypes_1.Roles)],
        },
    },
    numberOfEventsHosted: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    numberOfEventsAttended: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    password: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Password is required",
            },
            notEmpty: {
                msg: "Password is required",
            },
        },
    },
    bio: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    userImage: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    country: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isBlacklisted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isInitialProfileSetupDone: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    subscriptionPlan: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(modelTypes_1.SubscriptionPlans)),
        allowNull: false,
        validate: {
            isIn: [Object.values(modelTypes_1.SubscriptionPlans)],
        },
        defaultValue: modelTypes_1.SubscriptionPlans.Free,
    },
    accountStatus: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(modelTypes_1.AccountStatus)),
        allowNull: false,
        validate: {
            isIn: [Object.values(modelTypes_1.AccountStatus)],
        },
        defaultValue: modelTypes_1.AccountStatus.Active,
    },
    refreshToken: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    interests: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
    },
    noOfFollowers: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    noOfFollowings: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    otp: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
        defaultValue: null,
        validate: {
            isObject(value) {
                if (value && (typeof value !== "object" || Array.isArray(value))) {
                    throw new Error("Otp must be an object with `otp`, otpId and `expiresAt`");
                }
            },
        },
    },
    subScriptionId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        // references: {
        //   model: DatabaseSubscriptionPlans,
        //   key: "id",
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL'
        defaultValue: null,
    },
    subscriptionDetails: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: {
            type: modelTypes_1.SubscriptionPlans.Free,
            hasPaid: false,
            dateOfPayment: new Date(),
            dateOfExpiry: null,
            autoRenew: false
        },
    }
}, {
    sequelize: database_1.database,
    tableName: "User",
});
exports.default = User;
// catch (error) {
//   if (error.name === 'SequelizeUniqueConstraintError') {
//     console.error(error.errors[0].message); // Logs: "Username already in use"
//     throw new Error('Username already in use'); // Rethrow or handle as needed
//   }
