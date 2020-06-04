import {
  IForgotPasswordPayload,
  ISocialLoginPayload,
  ISocialLogin,
  IOtpVerify,
  OtpActionTypes,
  OtpTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';

class UserService {
  public fetchOtp = async (phone_number: string, country_code: string): Promise<void> => {
    const requestBody: IOtpVerify = {
      action: OtpActionTypes.SEND,
      payload: {
        media: [OtpTypes.PHONE],
        destination_details: [
          {
            country_code,
            phone_number,
          },
        ],
      },
    };

    await UserRepository.Otp(requestBody);
  };

  public verifyOtp = async (otp: string, phone_number: string, country_code: string): Promise<void> => {
    const requestBody: IOtpVerify = {
      action: OtpActionTypes.VERIFY,
      payload: {
        otp,
        media: [OtpTypes.PHONE],
        destination_details: [
          {
            country_code,
            phone_number,
          },
        ],
      },
    };

    const response = await UserRepository.Otp(requestBody);
    if (!response.otp_verify) {
      throw new Error();
    }
  };

  public resetPassword = async (payload: IForgotPasswordPayload): Promise<any> => {
    return await UserRepository.resetPassword(payload);
  };

  public socialLogin = async (payload: ISocialLoginPayload): Promise<ISocialLogin> => {
    return await UserRepository.socialLogin(payload);
  };

  public checkEmailExists = async (emailId: string): Promise<any> => {
    return await UserRepository.emailExists(emailId);
  };

  public checkPhoneNumberExists = async (phone: string): Promise<any> => {
    return await UserRepository.phoneExists(phone);
  };
}

const userService = new UserService();
export { userService as UserService };
