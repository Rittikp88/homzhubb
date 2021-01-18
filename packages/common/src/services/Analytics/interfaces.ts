import { ContactActions } from '@homzhub/common/src/domain/models/Search';
import { SocialAuthKeys } from '@homzhub/common/src/constants/SocialAuthProviders';

export enum AuthenticationType {
  EMAIL = 'email',
  OTP = 'otp',
  REFERRAL = 'referral',
}

export enum ListingType {
  RENT = 'Rent',
  SELL = 'Sell',
}

export interface IAuthenticationEvent {
  source: AuthenticationType | SocialAuthKeys;
  email?: string;
  phone_number?: string;
  error?: string;
}

export interface IAddPropertyEvent {
  property_address: string;
  error?: string;
}

export interface IContactOwnerEvent {
  source: ContactActions;
  property_address: string;
}

export interface IPropertyOpenEvent {
  property_address: string;
  listing_type: ListingType;
  asset_group_type: string;
  price: number;
  bedroom?: number;
  bathroom?: number;
  area?: number;
}

export interface ISearchEvent {
  search_string: string;
  listing_type: ListingType;
  asset_group_type: string;
  price_range?: string;
  bedroom?: number;
  bathroom?: number;
  area?: number;
  error?: string;
}

export type EventDataType =
  | IAuthenticationEvent
  | IAddPropertyEvent
  | IContactOwnerEvent
  | IPropertyOpenEvent
  | ISearchEvent;
