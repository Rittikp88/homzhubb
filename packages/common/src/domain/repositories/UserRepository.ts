import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { IUser } from '@homzhub/common/src/domain/models/User';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IEmailLoginPayload,
  IForgotPasswordPayload,
  IOtpLoginPayload,
  IOtpVerify,
  IOtpVerifyResponse,
  ISignUpPayload,
  ISocialLogin,
  ISocialLoginPayload,
  ISocialSignUpPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { ISocialMediaProvider } from '@homzhub/common/src/domain/models/SocialMediaProvider';
import { IOnboardingData } from '@homzhub/common/src/domain/models/Onboarding';

const ENDPOINTS = {
  onboarding: (): string => 'onboardings',
  socialMedia: (): string => 'social-providers/',
  signUp: (): string => 'users/',
  socialSignUp: (): string => 'users/social-signup/',
  login: (): string => 'users/login/',
  otp: (): string => 'otp/verifications/',
  forgotPasswordEmail: (): string => 'users/reset-password/',
  socialLogin: (): string => 'users/social-login/',
  emailExists: (emailId: string): string => `users/emails/${emailId}`,
  phoneExists: (phone: string): string => `users/phone-numbers/${phone}/`,
  logout: (): string => 'users/logout/',
};

class UserRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public getOnboarding = async (): Promise<IOnboardingData[]> => {
    return await this.apiClient.get(ENDPOINTS.onboarding());
  };

  public getSocialMedia = async (): Promise<ISocialMediaProvider[]> => {
    return await this.apiClient.get(ENDPOINTS.socialMedia());
  };

  public signUp = async (payload: ISignUpPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.signUp(), payload);
  };

  public socialSignUp = async (payload: ISocialSignUpPayload): Promise<IUser> => {
    const response = await this.apiClient.post(ENDPOINTS.socialSignUp(), payload);
    return {
      ...response.user,
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    };
  };

  public login = async (payload: IEmailLoginPayload | IOtpLoginPayload): Promise<IUser> => {
    const response = await this.apiClient.post(ENDPOINTS.login(), payload);
    return {
      ...response.user,
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    };
  };

  public socialLogin = async (payload: ISocialLoginPayload): Promise<IUser | { is_new_user: boolean }> => {
    const response: ISocialLogin = await this.apiClient.post(ENDPOINTS.socialLogin(), payload);
    if (!response.user) {
      return {
        is_new_user: response.is_new_user ?? true,
      } as { is_new_user: boolean };
    }

    return {
      ...response.user,
      access_token: response.access_token ?? '',
      refresh_token: response.refresh_token ?? '',
    } as IUser;
  };

  public Otp = async (requestPayload: IOtpVerify): Promise<IOtpVerifyResponse> => {
    return await this.apiClient.post(ENDPOINTS.otp(), requestPayload);
  };

  public resetPassword = async (payload: IForgotPasswordPayload): Promise<any> => {
    return await this.apiClient.put(ENDPOINTS.forgotPasswordEmail(), payload);
  };

  public emailExists = async (emailId: string): Promise<any> => {
    return await this.apiClient.get(ENDPOINTS.emailExists(emailId));
  };

  public phoneExists = async (phone: string): Promise<any> => {
    return await this.apiClient.get(ENDPOINTS.phoneExists(phone));
  };

  public logout = async (payload: any): Promise<any> => {
    // TODO: Add the return type of promise once the api is completely ready
    return await this.apiClient.post(ENDPOINTS.logout(), payload);
  };
}

const userRepository = new UserRepository();
export { userRepository as UserRepository };
