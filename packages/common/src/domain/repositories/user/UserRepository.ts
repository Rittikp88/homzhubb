import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { IUserRepository } from '@homzhub/common/src/domain/repositories/user/Interfaces';

const ENDPOINTS = {
  socialMedia: (): string => 'https://jsonplaceholder.typicode.com/users',
};

class UserRepository implements IUserRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getSocialMedia = async (): Promise<any> => {
    const url = ENDPOINTS.socialMedia(); // TODO: Replace OnboardingData with url once api is ready
    return await this.apiClient.get(url);
  };
}

const userRepository = new UserRepository();
export { userRepository as UserRepository };
