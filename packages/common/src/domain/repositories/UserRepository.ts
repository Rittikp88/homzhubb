import { BootstrapAppService } from '@homzhub/common/src/services/BootstrapAppService';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
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
  IRefreshTokenPayload,
  IUserExistsData,
  IUpdateWorkInfo,
  IUpdateEmergencyContact,
  IUpdatePassword,
  IUpdateProfile,
  IUpdateProfileResponse,
  IUpdateUserPreferences,
  IProfileImage,
  IEmailVerification,
  IReferralResponse,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { User } from '@homzhub/common/src/domain/models/User';
import { IUserProfile, UserProfile } from '@homzhub/common/src/domain/models/UserProfile';
import { UserPreferences } from '@homzhub/common/src/domain/models/UserPreferences';
import { UserSubscription } from '@homzhub/common/src/domain/models/UserSubscription';
import { SettingsData } from '@homzhub/common/src/domain/models/SettingsData';
import { SettingsDropdownValues } from '@homzhub/common/src/domain/models/SettingsDropdownValues';
import { UserInteraction } from '@homzhub/common/src/domain/models/UserInteraction';
import { SettingsScreenData } from '@homzhub/common/src/constants/Settings';

const ENDPOINTS = {
  signUp: 'users/',
  socialSignUp: 'users/social-signup/',
  login: 'users/login/',
  socialLogin: 'users/social-login/',
  otp: 'otp/verifications/',
  forgotPasswordEmail: 'users/reset-password/',
  logout: 'users/logout/',
  getUserSubscription: 'user/service-plan/',
  getUserProfile: 'users/profile/',
  updateEmergencyContact: 'users/emergency-contact/',
  updateWorkInfo: 'users/work-info/',
  changePassword: 'users/reset-password/',
  updateBasicProfile: 'users/basic-profile/',
  getUserPreferences: 'users/settings/',
  settingDropdownValues: 'user-settings/values/',
  updateUserPreferences: 'users/settings/',
  updateProfileImage: 'users/profile-pictures/',
  sendOrVerifyEmail: 'users/verifications/',
  wishlist: 'wishlists/',
  KYCDocuments: 'kyc-documents/',
  emailExists: (emailId: string): string => `users/emails/${emailId}/`,
  phoneExists: (phone: string): string => `users/phone-numbers/${phone}/`,
  interactions: (userId: number): string => `users/${userId}/interactions/`,
  verifyReferralCode: (code: string): string => `users/referrals/${code}/`,
};

class UserRepository {
  private apiClient: IApiClient;

  public constructor() {
    this.apiClient = BootstrapAppService.clientInstance;
  }

  public signUp = async (payload: ISignUpPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.signUp, payload);
  };

  public socialSignUp = async (payload: ISocialSignUpPayload): Promise<User> => {
    const response = await this.apiClient.post(ENDPOINTS.socialSignUp, payload);
    return ObjectMapper.deserialize(User, {
      ...response.user,
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    });
  };

  public login = async (payload: IEmailLoginPayload | IOtpLoginPayload): Promise<User> => {
    const response = await this.apiClient.post(ENDPOINTS.login, payload);
    return ObjectMapper.deserialize(User, {
      ...response.user,
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    });
  };

  public socialLogin = async (payload: ISocialLoginPayload): Promise<User | { is_new_user: boolean }> => {
    const response: ISocialLogin = await this.apiClient.post(ENDPOINTS.socialLogin, payload);
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
    return await this.apiClient.post(ENDPOINTS.otp, requestPayload);
  };

  public resetPassword = async (payload: IForgotPasswordPayload): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.forgotPasswordEmail, payload);
  };

  public emailExists = async (emailId: string): Promise<IUserExistsData> => {
    return await this.apiClient.get(ENDPOINTS.emailExists(emailId));
  };

  public phoneExists = async (phone: string): Promise<IUserExistsData> => {
    return await this.apiClient.get(ENDPOINTS.phoneExists(phone));
  };

  public logout = async (payload: IRefreshTokenPayload): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.logout, payload);
  };

  public getUserSubscription = async (): Promise<UserSubscription> => {
    const response = await this.apiClient.get(ENDPOINTS.getUserSubscription);
    return ObjectMapper.deserialize(UserSubscription, response);
  };

  public getUserProfile = async (): Promise<UserProfile> => {
    const response = await this.apiClient.get(ENDPOINTS.getUserProfile);
    return ObjectMapper.deserialize(UserProfile, response);
  };

  public updateEmergencyContact = async (payload: IUpdateEmergencyContact): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.updateEmergencyContact, payload);
  };

  public updateWorkInfo = async (payload: IUpdateWorkInfo): Promise<void> => {
    return await this.apiClient.post(ENDPOINTS.updateWorkInfo, payload);
  };

  public updatePassword = async (payload: IUpdatePassword): Promise<void> => {
    return await this.apiClient.put(ENDPOINTS.changePassword, payload);
  };

  public updateUserProfileByActions = async (payload: IUpdateProfile): Promise<IUpdateProfileResponse> => {
    return await this.apiClient.put(ENDPOINTS.updateBasicProfile, payload);
  };

  public getSettingDropDownValues = async (): Promise<SettingsDropdownValues> => {
    const response = await this.apiClient.get(ENDPOINTS.settingDropdownValues);
    return ObjectMapper.deserialize(SettingsDropdownValues, response);
  };

  public getUserPreferences = async (): Promise<UserPreferences> => {
    const response = await this.apiClient.get(ENDPOINTS.getUserPreferences);
    return ObjectMapper.deserialize(UserPreferences, response);
  };

  public updateUserPreferences = async (payload: IUpdateUserPreferences): Promise<UserPreferences> => {
    const response = await this.apiClient.patch(ENDPOINTS.updateUserPreferences, payload);
    return ObjectMapper.deserialize(UserPreferences, response);
  };

  public getSettingScreenData = (): SettingsData[] => {
    return ObjectMapper.deserializeArray(SettingsData, SettingsScreenData);
  };

  public updateProfileImage = async (payload: IProfileImage): Promise<IUserProfile> => {
    return await this.apiClient.put(ENDPOINTS.updateProfileImage, payload);
  };

  public sendOrVerifyEmail = async (payload: IEmailVerification): Promise<void> => {
    await this.apiClient.patch(ENDPOINTS.sendOrVerifyEmail, payload);
  };

  public getWishlistProperties = async (): Promise<Asset[]> => {
    const response = await this.apiClient.get(ENDPOINTS.wishlist);
    return ObjectMapper.deserializeArray(Asset, response);
  };

  public getUserInteractions = async (id: number): Promise<UserInteraction> => {
    const response = await this.apiClient.get(ENDPOINTS.interactions(id));
    return ObjectMapper.deserialize(UserInteraction, response);
  };

  public getKYCDocuments = async (): Promise<AssetDocument[]> => {
    const response = await this.apiClient.get(ENDPOINTS.KYCDocuments);
    return ObjectMapper.deserializeArray(AssetDocument, response);
  };

  public verifyReferalCode = async (code: string): Promise<IReferralResponse> => {
    return await this.apiClient.get(ENDPOINTS.verifyReferralCode(code));
  };
}

const userRepository = new UserRepository();
export { userRepository as UserRepository };
