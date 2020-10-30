import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IApiClient } from '@homzhub/common/src/network/Interfaces';
import {
  IEmailLoginPayload,
  IForgotPasswordPayload,
  IOtpLoginPayload,
  IOtpVerify,
  IOtpVerifyResponse,
  IResetPasswordData,
  ISignUpPayload,
  ISocialLogin,
  ISocialLoginPayload,
  ISocialSignUpPayload,
  IRefreshTokenPayload,
  IUserExistsData,
  IUpdateWorkInfo,
  IUpdateEmergencyContact,
  IUpdatePassword,
  IUpdateProfile,
  IUpdateProfileResponse,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { User } from '@homzhub/common/src/domain/models/User';
import { UserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { UserPreferences } from '@homzhub/common/src/domain/models/UserPreferences';
import { UserSubscription } from '@homzhub/common/src/domain/models/UserSubscription';
import { SettingsData } from '@homzhub/common/src/domain/models/SettingsData';
import { SettingsDropdownValues } from '@homzhub/common/src/domain/models/SettingsDropdownValues';
import { SettingsScreenData } from '@homzhub/common/src/constants/Settings';

const ENDPOINTS = {
  signUp: (): string => 'users/',
  socialSignUp: (): string => 'users/social-signup/',
  login: (): string => 'users/login/',
  socialLogin: (): string => 'users/social-login/',
  otp: (): string => 'otp/verifications/',
  forgotPasswordEmail: (): string => 'users/reset-password/',
  emailExists: (emailId: string): string => `users/emails/${emailId}`,
  phoneExists: (phone: string): string => `users/phone-numbers/${phone}/`,
  logout: (): string => 'users/logout/',
  getUserSubscription: (): string => 'user/service-plan/',
  getUserProfile: (): string => 'users/profile/',
  updateEmergencyContact: (): string => 'users/emergency-contact/',
  updateWorkInfo: (): string => 'users/work-info/',
  changePassword: (): string => 'users/reset-password/',
  updateBasicProfile: (): string => 'users/basic-profile/',
  getUserPreferences: (): string => 'users/settings/',
  settingDropdownValues: (): string => 'user-settings/values/',
};

class UserRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public signUp = async (payload: ISignUpPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.signUp(), payload);
  };

  public socialSignUp = async (payload: ISocialSignUpPayload): Promise<User> => {
    const response = await this.apiClient.post(ENDPOINTS.socialSignUp(), payload);
    return ObjectMapper.deserialize(User, {
      ...response.user,
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    });
  };

  public login = async (payload: IEmailLoginPayload | IOtpLoginPayload): Promise<User> => {
    const response = await this.apiClient.post(ENDPOINTS.login(), payload);
    return ObjectMapper.deserialize(User, {
      ...response.user,
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    });
  };

  public socialLogin = async (payload: ISocialLoginPayload): Promise<User | { is_new_user: boolean }> => {
    const response: ISocialLogin = await this.apiClient.post(ENDPOINTS.socialLogin(), payload);
    if (!response.user) {
      return {
        is_new_user: response.is_new_user ?? true,
      } as { is_new_user: boolean };
    }

    return ObjectMapper.deserialize(User, {
      ...response.user,
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    });
  };

  public Otp = async (requestPayload: IOtpVerify): Promise<IOtpVerifyResponse> => {
    return await this.apiClient.post(ENDPOINTS.otp(), requestPayload);
  };

  public resetPassword = async (payload: IForgotPasswordPayload): Promise<IResetPasswordData> => {
    return await this.apiClient.put(ENDPOINTS.forgotPasswordEmail(), payload);
  };

  public emailExists = async (emailId: string): Promise<IUserExistsData> => {
    return await this.apiClient.get(ENDPOINTS.emailExists(emailId));
  };

  public phoneExists = async (phone: string): Promise<IUserExistsData> => {
    return await this.apiClient.get(ENDPOINTS.phoneExists(phone));
  };

  public logout = async (payload: IRefreshTokenPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.logout(), payload);
  };

  public getUserSubscription = async (): Promise<UserSubscription> => {
    const response = await this.apiClient.get(ENDPOINTS.getUserSubscription());
    return ObjectMapper.deserialize(UserSubscription, response);
  };

  public getUserProfile = async (): Promise<UserProfile> => {
    const response = await this.apiClient.get(ENDPOINTS.getUserProfile());
    return ObjectMapper.deserialize(UserProfile, response);
  };

  public updateEmergencyContact = async (payload: IUpdateEmergencyContact): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.updateEmergencyContact(), payload);
  };

  public updateWorkInfo = async (payload: IUpdateWorkInfo): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.updateWorkInfo(), payload);
  };

  public updatePassword = async (payload: IUpdatePassword): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.changePassword(), payload);
  };

  public updateUserProfileByActions = async (payload: IUpdateProfile): Promise<IUpdateProfileResponse> => {
    return await this.apiClient.put(ENDPOINTS.updateBasicProfile(), payload);
  };

  public getSettingDropDownValues = async (): Promise<SettingsDropdownValues> => {
    const response = await this.apiClient.get(ENDPOINTS.settingDropdownValues());
    return ObjectMapper.deserialize(SettingsDropdownValues, response);
  };

  public getUserPreferences = async (): Promise<UserPreferences> => {
    const response = await this.apiClient.get(ENDPOINTS.getUserPreferences());
    return ObjectMapper.deserialize(UserPreferences, response);
  };

  public getSettingScreenData = (): SettingsData[] => {
    return ObjectMapper.deserializeArray(SettingsData, SettingsScreenData);
  };
}

const userRepository = new UserRepository();
export { userRepository as UserRepository };
