import {dyteServices} from "../../services";
import { ResponseDetails } from "../../types/generalTypes";
import { errorUtilities } from "../../utilities";



const getAllDyteMeetingsService = errorUtilities.withErrorHandling(
    async (): Promise<Record<string, any>> => {
      const responseHandler: ResponseDetails = {
        statusCode: 0,
        message: "",
        data: {}
      };
  
      const dyteEvents = await dyteServices.getDyteMeetings()
  
      responseHandler.statusCode = 200;
      responseHandler.message = "Meetings Fetched Successfully";
      responseHandler.data = {
        events: dyteEvents.data
      };
      return responseHandler;
    }
  );


export default {
    getAllDyteMeetingsService
}