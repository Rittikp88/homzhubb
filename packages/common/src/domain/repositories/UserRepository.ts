import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IEmailLoginPayload,
  IMobileLoginPayload,
  ISignUpPayload,
  IForgotPasswordPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  socialMedia: (): string => 'https://jsonplaceholder.typicode.com/users',
  signUp: (): string => 'users/',
  login: (): string => 'users/login/',
  fetchOtp: (): string => '',
  verifyOtp: (): string => '',
  forgotPasswordEmail: (): string => 'users/reset-password/',
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

  public login = async (payload: IEmailLoginPayload | IMobileLoginPayload): Promise<any> => {
    return await this.apiClient.post(ENDPOINTS.login(), payload);
  };

  public fetchOtp = async (): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.fetchOtp());
  };

  public verifyOtp = async (): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.verifyOtp());
  };

  public resetPassword = async (payload: IForgotPasswordPayload): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.forgotPasswordEmail(), payload);
  };
}

const userRepository = new UserRepository();
export { userRepository as UserRepository };
