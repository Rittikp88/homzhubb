import { IUser } from '@homzhub/common/src/domain/models/User';

export enum LoginTypes {
  OTP = 'OTP_LOGIN',
  EMAIL = 'EMAIL_LOGIN',
  SOCIAL_MEDIA = 'SOCIAL_LOGIN',
}

export enum OtpActionTypes {
  SEND = 'SEND_OTP',
  VERIFY = 'VERIFY_OTP',
}

export enum OtpTypes {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
}

export enum SpaceAvailableTypes {
  BATHROOM = 'Bathroom',
  BEDROOM = 'Bedroom',
  TOTAL_FLOORS = 'Total Floors',
  FLOOR_NUMBER = 'Floor number',
  BALCONY = 'Balcony',
}

export interface ISpaceAvailable {
  bedroom: number;
  bathroom: number;
  balcony: number;
  floorNumber: number;
  totalFloors: number;
  carpetArea: string;
  areaUnit: string;
}

export interface ISpaceAvailablePayload {
  id: string | number;
  name?: string;
  value?: number;
  count?: number;
}

export interface ISignUpPayload {
  full_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  password: string;
}

export interface IEmailLoginPayload {
  action: LoginTypes.EMAIL;
  payload: {
    email: string;
    password: string;
  };
}

export interface ISocialLogin {
  is_new_user: boolean;
  payload: IUser;
}

export interface ISocialLoginPayload {
  action: LoginTypes.SOCIAL_MEDIA;
  payload: {
    provider: string;
    id_token: string;
  };
}

export interface IOtpLoginPayload {
  action: LoginTypes.OTP;
  payload: {
    country_code: string;
    phone_number: string;
    otp: string;
  };
}

export interface ILoginFormData {
  email: string;
  password: string;
  country_code: string;
  phone_number: string;
}

export interface IForgotPasswordPayload {
  action: string;
  payload: {
    email?: string;
    token?: string | number;
    password?: string;
  };
}

interface IOtpPhoneVerifyPayload {
  country_code: string;
  phone_number: string;
}

interface IOtpEmailVerifyPayload {
  email: string;
}

export interface IOtpVerify {
  action: OtpActionTypes;
  payload: {
    otp?: string;
    media: [OtpTypes];
    destination_details: [IOtpPhoneVerifyPayload | IOtpEmailVerifyPayload];
  };
}

export interface IOtpVerifyResponse {
  otp_verify?: boolean;
  otp_sent?: boolean;
}

export interface IUserPayload {
  full_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  access_token: string;
  refresh_token: string;
}

export interface IRefreshTokenPayload {
  refresh_token: string;
}

export interface IUserLogoutPayload {
  action: string;
  payload: IRefreshTokenPayload;
}

// POST PROPERTY
export interface ICreateAssetDetails {
  project_name: string;
  unit_number: string;
  block_number: string;
  latitude: string;
  longitude: string;
}

export interface ICreateAssetResult {
  id: number;
}

export interface IUpdateAssetDetails {
  project_name?: string;
  unit_number?: string;
  block_number?: string;
  latitude?: string;
  longitude?: string;
  carpet_area?: string;
  carpet_area_unit?: string;
  floor_number?: number;
  total_floors?: number;
  asset_type?: number;
  spaces?: ISpaceAvailablePayload[];
}
