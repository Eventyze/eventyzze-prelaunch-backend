import { dyteServices } from "../../services";
import { errorUtilities } from "../../utilities";
import { AdminServiceResponses } from "../../types/responseTypes/adminServiceResponses";
import { StatusCodes } from "../../types/responseTypes/statusCodes";
import handleServicesResponse from "../../utilities/responseHandlers/response.utilities";

const getAllDyteMeetingsService = errorUtilities.withErrorHandling(
  async (): Promise<Record<string, any>> => {
    const dyteEvents = await dyteServices.getDyteMeetings();

    return handleServicesResponse.handleServicesResponse(
      StatusCodes.OK,
      AdminServiceResponses.MEETINGS_FETCHED_SUCCESSFULLY,
      {
        events: dyteEvents.data,
      }
    );
  }
);

export default {
  getAllDyteMeetingsService,
};
