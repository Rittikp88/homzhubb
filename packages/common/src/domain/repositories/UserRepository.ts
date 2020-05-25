import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IUser } from '@homzhub/common/src/domain/models/User';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IEmailLoginPayload,
  IOtpLoginPayload,
  ISignUpPayload,
  IForgotPasswordPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  socialMedia: (): string => '',
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

  public signUp = async (payload: ISignUpPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.signUp(), payload);
  };

  public login = async (payload: IEmailLoginPayload | IOtpLoginPayload): Promise<IUser> => {
    const response = await this.apiClient.post(ENDPOINTS.login(), payload);
    return {
      ...response.user,
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    };
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
