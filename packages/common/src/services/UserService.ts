import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { IOtpVerify, OtpActionTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';

class UserService {
  public fetchOtp = async (phone_number: string, country_code: string): Promise<void> => {
    const requestBody: IOtpVerify = {
      action: OtpActionTypes.SEND,
      payload: {
        country_code,
        phone_number,
      },
    };
    try {
      await UserRepository.Otp(requestBody);
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  public verifyOtp = async (otp: string, phone_number: string, country_code: string): Promise<void> => {
    const requestBody: IOtpVerify = {
      action: OtpActionTypes.VERIFY,
      payload: {
        otp,
        country_code,
        phone_number,
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
