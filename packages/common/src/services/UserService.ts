import { IOtpVerify, OtpActionTypes, OtpTypes } from '@homzhub/common/src/domain/repositories/interfaces';
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
}

const userService = new UserService();
export { userService as UserService };
