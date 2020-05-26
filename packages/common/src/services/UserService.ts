import {
  ISignUpPayload,
  IForgotPasswordPayload,
  ISocialLoginPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';

class UserService {
  public fetchOtp = async (): Promise<void> => {
    await UserRepository.fetchOtp();
  };

  public verifyOtp = async (): Promise<void> => {
    await UserRepository.verifyOtp();
  };

  public signUpService = async (payload: ISignUpPayload): Promise<void> => {
    return await UserRepository.signUp(payload);
  };

  public resetPassword = async (payload: IForgotPasswordPayload): Promise<any> => {
    return await UserRepository.resetPassword(payload);
  };

  public socialLogin = async (payload: ISocialLoginPayload): Promise<any> => {
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
