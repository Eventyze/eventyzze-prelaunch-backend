import { Request, Response } from "express";
import { userEmailAuthService } from "../../services";
import { responseUtilities } from "../../utilities";
import { JwtPayload } from "jsonwebtoken";
import { googleAuthService } from "../../services";
import { facebookAuthService } from "../../services";
import { passwordResetService } from "../../services";

const userRegisterWithEmail = async (
  request: Request,
  response: Response
): Promise<any> => {

  console.log('body', request.body)
  
  const newUser: any = await userEmailAuthService.userRegisterWithEmailService(
    request.body
  );

  return responseUtilities.responseHandler(
    response,
    newUser.message,
    newUser.statusCode,
    newUser.data
  );
};


const userVerifiesOtp = async (
  request: JwtPayload,
  response: Response
): Promise<any> => {

  const newUser: any = await userEmailAuthService.userVerifiesOtp(
   request.body
  );

  console.log('bod', request.body)

  return responseUtilities.responseHandler(
    response,
    newUser.message,
    newUser.statusCode,
    newUser.data
  );
};

const userLoginWithEmail = async (
  request: Request,
  response: Response
): Promise<any> => {
  const loggedInUser: any = await userEmailAuthService.userLogin(request.body);

  if(loggedInUser.statusCode === 200){
  response
    .header("x-access-token", loggedInUser.data.accessToken)
    .header("x-refresh-token", loggedInUser.data.refreshToken);
  }
  
  return responseUtilities.responseHandler(
    response,
    loggedInUser.message,
    loggedInUser.statusCode,
    loggedInUser.data,
  );
};

const userResendsOtp = async (
  request: Request,
  response: Response
): Promise<any> => {

  const resentOtp: any = await userEmailAuthService.userResendsOtpService(request.query);
  
  return responseUtilities.responseHandler(
    response,
    resentOtp.message,
    resentOtp.statusCode,
    resentOtp.data,
  );
};

const googleAuth = async (
  request: Request,
  response: Response
): Promise<any> => {
  const { token } = request.body;

  const authResponse: any = await googleAuthService.googleAuthService(token);

  if (authResponse.statusCode === 200 || authResponse.statusCode === 201) {
    response
      .header("x-access-token", authResponse.data.accessToken)
      .header("x-refresh-token", authResponse.data.refreshToken);
  }

  return responseUtilities.responseHandler(
    response,
    authResponse.message,
    authResponse.statusCode,
    authResponse.data
  );
};

const facebookAuth = async (
  request: Request,
  response: Response
): Promise<any> => {
  const { accessToken } = request.body;

  const authResponse: any = await facebookAuthService.facebookAuthService(accessToken);

  if (authResponse.statusCode === 200 || authResponse.statusCode === 201) {
    response
      .header("x-access-token", authResponse.data.accessToken)
      .header("x-refresh-token", authResponse.data.refreshToken);
  }

  return responseUtilities.responseHandler(
    response,
    authResponse.message,
    authResponse.statusCode,
    authResponse.data
  );
};

const requestPasswordReset = async (
  request: Request,
  response: Response
): Promise<any> => {
  const { email } = request.body;

  const resetResponse: any = await passwordResetService.requestPasswordReset(email);

  return responseUtilities.responseHandler(
    response,
    resetResponse.message,
    resetResponse.statusCode,
    resetResponse.data
  );
};

const resetPassword = async (
  request: Request,
  response: Response
): Promise<any> => {
  const resetResponse: any = await passwordResetService.resetPassword(request.body);

  return responseUtilities.responseHandler(
    response,
    resetResponse.message,
    resetResponse.statusCode,
    resetResponse.data
  );
};

const userLogout = async (
  request: Request,
  response: Response
): Promise<any> => {

  const loggedOutUser: any = await userEmailAuthService.userLogoutService(request.body);
  
  return responseUtilities.responseHandler(
    response,
    loggedOutUser.message,
    loggedOutUser.statusCode,
    loggedOutUser.data,
  );
};

export default {
  userRegisterWithEmail,
  userVerifiesOtp,
  userLoginWithEmail,
  userResendsOtp,
  googleAuth,
  facebookAuth,
  requestPasswordReset,
  resetPassword,
  userLogout
};
