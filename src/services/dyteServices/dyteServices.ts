import { errorUtilities } from '../../utilities';
import dyteAxios from '../../configurations/dyteConfig';
import { ParticipantDetails } from '../../types/dyteTypes';

const createDyteMeeting = async(meetingData:any):Promise<any> => {
    try{

        const response = await dyteAxios.post('/meetings', meetingData)
        return response.data;

    }catch(error:any){
        throw errorUtilities.createError(
            `Error creating meeting: ${error.message}`,
            500
          );
    }
}


const getDyteMeetings = async():Promise<any> => {
    try{

        const response = await dyteAxios.get('/meetings')
        return response.data;

    }catch(error:any){
        throw errorUtilities.createError(
            `Error fetching meetings: ${error.message}`,
            500
          );
    }
}

const getASingleDyteMeeting = async(meetingId:string):Promise<any> => {
    try{

        const response = await dyteAxios.get(`/meetings/${meetingId}`)
        return response.data;

    }catch(error:any){
        throw errorUtilities.createError(
            `Error fetching meeting: ${error.message}`,
            500
          );
    }
}

const getDyteMeetingParticipants = async(meetingId:string):Promise<any> => {
    try{

        const response = await dyteAxios.get(`/meetings/${meetingId}/participants`)
        return response.data;

    }catch(error:any){
        throw errorUtilities.createError(
            `Error fetching participants: ${error.message}`,
            500
          );
    }
}


const addAParticipantToDyteMeeting = async(meetingId:string, userDetails:ParticipantDetails):Promise<any> => {
    try{

        const response = await dyteAxios.post(`/meetings/${meetingId}/participants`, userDetails)
        return response.data;

    }catch(error:any){
        throw errorUtilities.createError(
            `Error fetching participant: ${error.message}`,
            500
          );
    }
}


// https://api.dyte.io/v2/meetings/{meeting_id}/participants/{participant_id}


const deleteAParticipantFromDyteMeeting = async(meetingId:string, participantId:string):Promise<any> => {
    try{

        const response = await dyteAxios.delete(`/meetings/${meetingId}/participants/${participantId}`)
        return response.data;

    }catch(error:any){
        throw errorUtilities.createError(
            `Error deleting participant: ${error.message}`,
            500
          );
    }
}


const getDyteMeetingParticipantDetails = async(meetingId:string, participantId:string):Promise<any> => {
    try{

        const response = await dyteAxios.get(`/meetings/${meetingId}/participants/${participantId}`)
        return response.data;

    }catch(error:any){
        throw errorUtilities.createError(
            `Error fetching details: ${error.message}`,
            500
          );
    }
}


const startDyteLiveStream = async(meetingId:string):Promise<any> => {
    try{

        const response = await dyteAxios.post(`/meetings/${meetingId}/livestreams`)
        return response.data;

    }catch(error:any){
        throw errorUtilities.createError(
            `Error starting livestream: ${error.message}`,
            500
          );
    }
}


const stopDyteLiveStream = async(meetingId:string):Promise<any> => {
    try{

        const response = await dyteAxios.post(`/meetings/${meetingId}/livestreams`)
        return response.data;

    }catch(error:any){
        throw errorUtilities.createError(
            `Error starting livestream: ${error.message}`,
            500
          );
    }
}


const getDetailsOfActiveDyteLiveStream = async(meetingId:string):Promise<any> => {
    try{

        const response = await dyteAxios.get(`/meetings/${meetingId}/active-livestream`)
        return response.data;

    }catch(error:any){
        throw errorUtilities.createError(
            `Error fetching details: ${error.message}`,
            500
          );
    }
}
// support@dyte.io



export default {
    createDyteMeeting,
    getDyteMeetings,
    getASingleDyteMeeting,
    getDyteMeetingParticipants,
    addAParticipantToDyteMeeting,
    deleteAParticipantFromDyteMeeting,
    getDyteMeetingParticipantDetails,
    startDyteLiveStream,
    getDetailsOfActiveDyteLiveStream
}