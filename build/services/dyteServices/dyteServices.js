"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("../../utilities");
const dyteConfig_1 = __importDefault(require("../../configurations/dyteConfig"));
const createDyteMeeting = async (meetingData) => {
    try {
        const response = await dyteConfig_1.default.post('/meetings', meetingData);
        return response.data;
    }
    catch (error) {
        throw utilities_1.errorUtilities.createError(`Error creating meeting: ${error.message}`, 500);
    }
};
const getDyteMeetings = async () => {
    try {
        const response = await dyteConfig_1.default.get('/meetings');
        return response.data;
    }
    catch (error) {
        throw utilities_1.errorUtilities.createError(`Error fetching meetings: ${error.message}`, 500);
    }
};
const getASingleDyteMeeting = async (meetingId) => {
    try {
        const response = await dyteConfig_1.default.get(`/meetings/${meetingId}`);
        return response.data;
    }
    catch (error) {
        throw utilities_1.errorUtilities.createError(`Error fetching meeting: ${error.message}`, 500);
    }
};
const getDyteMeetingParticipants = async (meetingId) => {
    try {
        const response = await dyteConfig_1.default.get(`/meetings/${meetingId}/participants`);
        return response.data;
    }
    catch (error) {
        throw utilities_1.errorUtilities.createError(`Error fetching participants: ${error.message}`, 500);
    }
};
const addAParticipantToDyteMeeting = async (meetingId, userDetails) => {
    try {
        const response = await dyteConfig_1.default.post(`/meetings/${meetingId}/participants`, userDetails);
        return response.data;
    }
    catch (error) {
        throw utilities_1.errorUtilities.createError(`Error fetching participant: ${error.message}`, 500);
    }
};
// https://api.dyte.io/v2/meetings/{meeting_id}/participants/{participant_id}
const deleteAParticipantFromDyteMeeting = async (meetingId, participantId) => {
    try {
        const response = await dyteConfig_1.default.delete(`/meetings/${meetingId}/participants/${participantId}`);
        return response.data;
    }
    catch (error) {
        throw utilities_1.errorUtilities.createError(`Error deleting participant: ${error.message}`, 500);
    }
};
const getDyteMeetingParticipantDetails = async (meetingId, participantId) => {
    try {
        const response = await dyteConfig_1.default.get(`/meetings/${meetingId}/participants/${participantId}`);
        return response.data;
    }
    catch (error) {
        throw utilities_1.errorUtilities.createError(`Error fetching details: ${error.message}`, 500);
    }
};
const startDyteLiveStream = async (meetingId) => {
    try {
        const response = await dyteConfig_1.default.post(`/meetings/${meetingId}/livestreams`);
        return response.data;
    }
    catch (error) {
        throw utilities_1.errorUtilities.createError(`Error starting livestream: ${error.message}`, 500);
    }
};
const stopDyteLiveStream = async (meetingId) => {
    try {
        const response = await dyteConfig_1.default.post(`/meetings/${meetingId}/livestreams`);
        return response.data;
    }
    catch (error) {
        throw utilities_1.errorUtilities.createError(`Error starting livestream: ${error.message}`, 500);
    }
};
const getDetailsOfActiveDyteLiveStream = async (meetingId) => {
    try {
        const response = await dyteConfig_1.default.get(`/meetings/${meetingId}/active-livestream`);
        return response.data;
    }
    catch (error) {
        throw utilities_1.errorUtilities.createError(`Error fetching details: ${error.message}`, 500);
    }
};
// support@dyte.io
exports.default = {
    createDyteMeeting,
    getDyteMeetings,
    getASingleDyteMeeting,
    getDyteMeetingParticipants,
    addAParticipantToDyteMeeting,
    deleteAParticipantFromDyteMeeting,
    getDyteMeetingParticipantDetails,
    startDyteLiveStream,
    getDetailsOfActiveDyteLiveStream
};
