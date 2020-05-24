import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import { ISignUpPayload } from './interfaces';

const ENDPOINTS = {
  socialMedia: (): string => 'https://jsonplaceholder.typicode.com/users',
  signUp: (): string => 'users/',
  fetchOtp: (): string => '',
  verifyOtp: (): string => '',
};

class UserRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getSocialMedia = async (): Promise<any> => {
    const url = ENDPOINTS.socialMedia(); // TODO: Replace OnboardingData with url once api is ready
    return await this.apiClient.get(url);
  };

  public signUp = async (payload: ISignUpPayload): Promise<any> => {
    return await this.apiClient.post(ENDPOINTS.signUp(), payload);
  };

  public fetchOtp = async (): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.fetchOtp());
  };

  public verifyOtp = async (): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.verifyOtp());
  };
}

const userRepository = new UserRepository();
export { userRepository as UserRepository };
