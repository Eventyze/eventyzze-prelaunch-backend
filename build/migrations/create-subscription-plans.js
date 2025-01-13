"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert("DatabaseSubscriptionPlans", [
            {
                id: (0, uuid_1.v4)(),
                name: "Free",
                permissions: ["view_events"],
                attendeeLimit: 100, // Example for free plan
                streamingLimitHours: 0, // No streaming allowed
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: (0, uuid_1.v4)(),
                name: "Basic",
                permissions: ["view_events", "host_events", "stream_live"],
                attendeeLimit: 2000, // Maximum 2000 attendees
                streamingLimitHours: 6, // Maximum 6 hours of streaming
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: (0, uuid_1.v4)(),
                name: "Premium",
                permissions: ["view_events", "host_events", "stream_live", "unlimited_attendees"],
                attendeeLimit: null, // No limit
                streamingLimitHours: null, // No limit
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("DatabaseSubscriptionPlans", {}, {});
    },
};
