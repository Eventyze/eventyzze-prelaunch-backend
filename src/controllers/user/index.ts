import { Request, Response } from "express";
import { userEmailAuthService, userServices } from "../../services";
import { responseUtilities } from "../../utilities";
import { JwtPayload } from "jsonwebtoken";

const updateUserProfile = async (
  request: JwtPayload,
  response: Response
): Promise<any> => {

    const { id } = request.user

  const newUser: any = await userServices.userProfileUpdateService(
    { ...request.body, id }
  );

  return responseUtilities.responseHandler(
    response,
    newUser.message,
    newUser.statusCode,
    newUser.data
  );
};

const firstTimeProfileUpdate = async (
  request: JwtPayload,
  response: Response
): Promise<any> => {

    const { id } = request.user


  const newUpdate: any = await userServices.userfirstimeProfileUpdateService(
    { ...request.body, id }
  );

  return responseUtilities.responseHandler(
    response,
    newUpdate.message,
    newUpdate.statusCode,
    newUpdate.data
  );
};

const changeUserImage = async (
  request: JwtPayload,
  response: Response
): Promise<any> => {

  const { id } = request.user

  const imageUrl = request?.files?.['image'] ? request.files['image'][0].path : null;

  const newUserImage: any = await userServices.updateUserImageService(imageUrl, id)

  return responseUtilities.responseHandler(
    response,
    newUserImage.message,
    newUserImage.statusCode,
    newUserImage.data
  );
};

const confirmUserName = async (
  request: JwtPayload,
  response: Response
): Promise<any> => {
  const { userName } = request.query;

  const userNameConfirmation = await userServices.confirmUserNameService(userName)

  return responseUtilities.responseHandler(
    response,
    userNameConfirmation.message,
    userNameConfirmation.statusCode
  );
}
export default {
    updateUserProfile,
    changeUserImage,
    firstTimeProfileUpdate,
    confirmUserName
}