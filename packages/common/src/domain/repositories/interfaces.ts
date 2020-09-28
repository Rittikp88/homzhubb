import { ILastVisitedStep } from '@homzhub/common/src/domain/models/Asset';

// ENUMS
export enum LoginTypes {
  OTP = 'OTP_LOGIN',
  EMAIL = 'EMAIL_LOGIN',
  SOCIAL_MEDIA = 'SOCIAL_LOGIN',
}

export enum OtpActionTypes {
  SEND = 'SEND_OTP',
  VERIFY = 'VERIFY_OTP',
}

export enum SpaceAvailableTypes {
  BATHROOM = 'Bathroom',
  BEDROOM = 'Bedroom',
  TOTAL_FLOORS = 'Total Floors',
  FLOOR_NUMBER = 'Floor number',
  BALCONY = 'Balcony',
}

export enum VisitType {
  PHYSICAL = 'PHYSICAL',
  VIRTUAL = 'VIRTUAL',
  PROPERTY_VIEW = 'PROPERTY_VIEW',
}

// ENUMS - END

// USER AUTH - START
export interface ISignUpPayload {
  full_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  password: string;
}

export interface ISocialSignUpPayload {
  otp: string;
  user_details: ISignUpPayload;
}

export interface IEmailLoginPayload {
  action: LoginTypes.EMAIL;
  payload: {
    email: string;
    password: string;
  };
}

export interface ILoginPayload {
  data: IEmailLoginPayload | IOtpLoginPayload;
  callback?: () => void;
}

export interface ISocialLogin {
  is_new_user?: boolean;
  access_token?: string;
  refresh_token?: string;
  user?: {
    full_name: string;
    email: string;
    country_code: string;
    phone_number: string;
  };
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

export interface IResetPasswordData {
  email_exists: boolean;
  token: string;
}

export interface IUserExistsData {
  is_exists: boolean;
}

export interface IUserPayload {
  full_name: string;
  email: string;
  country_code: string;
  phone_number: string;
  access_token: string;
  refresh_token: string;
}

// USER AUTH - END

// OTP - START
export interface IOtpSendPayload {
  country_code: string;
  phone_number: string;
}

export interface IOtpVerifyPayload extends IOtpSendPayload {
  otp: string;
}

export interface IOtpVerify {
  action: OtpActionTypes;
  payload: IOtpSendPayload | IOtpVerifyPayload;
}

export interface IOtpVerifyResponse {
  otp_verify?: boolean;
  otp_sent?: boolean;
}

// OTP - END

// REFRESH TOKEN - START
export interface IRefreshToken {
  access_token: string;
  refresh_token: string;
}

export interface IRefreshTokenPayload {
  refresh_token: string;
}

// REFRESH TOKEN - END

// USER LOGOUT - START
export interface IUserLogoutPayload {
  action: string;
  payload: IRefreshTokenPayload;
}

// USER LOGOUT - END

// ASSET - START
export interface ISpaceAvailable {
  bedroom: number;
  bathroom: number;
  balcony: number;
  floorNumber: number;
  totalFloors: number;
  carpetArea: string;
  areaUnit: number;
}

export interface ISpaceAvailablePayload {
  space_type: string | number;
  name?: string;
  value?: number;
  count?: number;
  description?: string;
}

export interface ICreateAssetParams {
  project_name: string;
  unit_number: string;
  block_number: string;
  latitude: string | number;
  longitude: string | number;
  address: string;
  pin_code: string;
  city_name: string;
  state_name: string;
  country_name: string;
  country_iso2_code: string;
  asset_type: number;
  last_visited_step?: ILastVisitedStep;
}

export interface ICreateAssetResult {
  id: number;
}

export interface IUpdateAssetParams {
  project_name?: string;
  unit_number?: string;
  block_number?: string;
  latitude?: string | number;
  longitude?: string | number;
  address?: string;
  pin_code?: string;
  city_name?: string;
  state_name?: string;
  country_iso2_code?: string;
  country_name?: string;
  carpet_area?: number;
  carpet_area_unit?: number;
  floor_number?: number;
  total_floors?: number;
  asset_type?: number;
  last_visited_step?: ILastVisitedStep;
  spaces?: ISpaceAvailablePayload[];
  asset_highlights?: string[];
  is_gated?: boolean;
  power_backup?: boolean;
  corner_property?: boolean;
  all_day_access?: boolean;
  amenities?: number[];
  facing?: string;
  floor_type?: number;
  furnishing_description?: string;
  construction_year?: number;
  furnishing?: string;
}

// ASSET - END

// Property Search
export interface IPropertySearchPayload {
  asset_group: number;
  price__gte: number;
  price__lte: number;
  latitude: number;
  longitude: number;
  limit: number;
  offset: number;
  bathroom__gte: number;
  move_in_date__gte?: string;
  furnishing__in?: string;
  facing__in?: string;
  amenities__in?: string;
  rent_free_period?: number;
  is_verified?: boolean;
  agent_listed?: boolean;
  age__gte?: string;
  search_radius?: number;
  date_added?: string;
  asset_type__in?: string;
  bedroom__gte?: number;
  bedroom__in?: number;
  carpet_area__lt?: number;
  carpet_area__gt?: number;
  carpet_area_unit?: number;
}

// Lead
export interface ILeadPayload {
  propertyTermId: number;
  data: {
    spaces?: any;
    contact_person_type?: string;
    lead_type: string;
    message?: string;
    person_contacted?: number;
    preferred_contact_time?: any;
    is_wishlisted?: boolean;
    user_search?: null;
  };
}

export interface IGeneralLedgerPayload {
  transaction_date__lte: string;
  transaction_date__gte: string;
  transaction_date_group_by: string;
}

export interface IAddGeneralLedgerPayload {
  asset: number;
  entry_type: string;
  label: string;
  payer_name?: string;
  receiver_name?: string;
  amount: number;
  category: number;
  transaction_date: string;
  notes: string | null;
  attachment: number | null;
}

export interface ICreateLedgerResult {
  id: number;
}

export interface INotificationsPayload {
  limit?: number;
  offset?: number;
  q?: string;
  lease_listing_id?: number;
  sale_listing_id?: number;
}

export interface IDocumentPayload {
  attachment: number;
  lease_listing_id?: number;
  sale_listing_id?: number;
}

export interface ICreateDocumentPayload {
  propertyId: number;
  documentData: IDocumentPayload[];
}

export interface IUpcomingVisitPayload {
  start_date__gte: string;
  visit_type: VisitType;
  sale_listing_id: number | null;
  lease_listing_id: number | null;
}

export interface IScheduleVisitPayload {
  visit_type: VisitType;
  lead_type: number;
  start_date: string;
  end_date: string;
  sale_listing: number | null;
  lease_listing: number | null;
  comments?: string;
}

export interface IPropertyImagesPostPayload {
  attachment: number;
  is_cover_image: boolean;
}

export interface IMarkCoverImageAttachment {
  cover_updated: boolean;
}

export interface IGetSaleTermsParams {
  status: 'DRAFT';
}

export interface IOrderSummaryPayload {
  services?: number[];
  coins?: number;
  promo_code?: string;
}
