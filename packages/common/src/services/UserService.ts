import { ISignUpPayload, IForgotPasswordPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';

class UserService {
  public signUpService = async (payload: ISignUpPayload): Promise<any> => {
    return await UserRepository.signUp(payload);
  };

  public resetPassword = async (payload: IForgotPasswordPayload): Promise<any> => {
    return await UserRepository.resetPassword(payload);
  };
}

const userService = new UserService();
export { userService as UserService };
