import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';

class UserService {
  public signUpService = async (payload: ISignUpPayload): Promise<any> => {
    return await UserRepository.signUp(payload);
  };
}

const userService = new UserService();
export { userService as UserService };
