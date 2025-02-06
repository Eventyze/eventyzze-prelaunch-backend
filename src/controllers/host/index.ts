import { Request, Response } from "express";
import { hostServices } from "../../services";
import { responseUtilities } from "../../utilities";
import { JwtPayload } from "jsonwebtoken";

const allHosts = async (
  request: JwtPayload,
  response: Response
): Promise<any> => {

  const newUser: any = await hostServices.getAllHostsService();

  return responseUtilities.responseHandler(
    response,
    newUser.message,
    newUser.statusCode,
    newUser.data
  );
};

const hostCreatesEvent = async (
  request: JwtPayload,
  response: Response
): Promise<any> => {

  const userId = request.user.id;

  const imageUrl = request?.files?.['image'] ? request.files['image'][0].path : null;
  const videoUrl = request?.files?.['video'] ? request.files['video'][0].path : null;

  request.body.coverImage = imageUrl;
  request.body.videoUrl = videoUrl;

  const newEvent = await hostServices.hostCreatesEventService(userId, request.body);

  return responseUtilities.responseHandler(
    response,
    newEvent.message,
    newEvent.statusCode,
    newEvent.data
  );


}


export default {
    allHosts,
    hostCreatesEvent
}