import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IUser } from '@homzhub/common/src/domain/models/User';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IEmailLoginPayload,
  IOtpLoginPayload,
  ISignUpPayload,
  IForgotPasswordPayload,
  ISocialLoginPayload,
  ISocialLogin,
} from '@homzhub/common/src/domain/repositories/interfaces';

const ENDPOINTS = {
  socialMedia: (): string => 'social-providers/',
  signUp: (): string => 'users/',
  login: (): string => 'users/login/',
  fetchOtp: (): string => '',
  verifyOtp: (): string => '',
  forgotPasswordEmail: (): string => 'users/reset-password/',
  socialLogin: (): string => 'users/social-login/',
  emailExists: (emailId: string): string => `users/emails/${emailId}`,
  phoneExists: (phone: string): string => `users/phone-numbers/${phone}/`,
};

class UserRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getSocialMedia = async (): Promise<[]> => {
    return await this.apiClient.get(ENDPOINTS.socialMedia());
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

  public socialLogin = async (payload: ISocialLoginPayload): Promise<ISocialLogin> => {
    return await this.apiClient.post(ENDPOINTS.socialLogin(), payload);
  };

  public emailExists = async (emailId: string): Promise<any> => {
    return await this.apiClient.get(ENDPOINTS.emailExists(emailId));
  };

  public phoneExists = async (phone: string): Promise<any> => {
    return await this.apiClient.get(ENDPOINTS.phoneExists(phone));
  };
}

const userRepository = new UserRepository();
export { userRepository as UserRepository };
