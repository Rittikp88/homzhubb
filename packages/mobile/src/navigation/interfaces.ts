import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ISocialUserData } from '@homzhub/common/src/assets/constants';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { User } from '@homzhub/common/src/domain/models/User';

// Route keys
export enum ScreensKeys {
  // Auth
  OnBoarding = 'OnBoarding',
  Home = 'Home',
  GettingStarted = 'GettingStarted',
  SignUp = 'SignUp',
  OTP = 'OTP',
  MobileVerification = 'MobileVerification',
  Login = 'Login',
  EmailLogin = 'EmailLogin',
  ForgotPassword = 'ForgotPassword',
  SuccessResetPassword = 'SuccessResetPassword',
  ResetPassword = 'ResetPassword',

  // Post Property
  PropertyPostLandingScreen = 'PropertyPost',
  PostPropertySearch = 'PostPropertySearch',
  PostPropertyMap = 'PostPropertyMap',
  PropertyDetailsScreen = 'PropertyDetails',
  RentServicesScreen = 'RentServices',

  // Service
  ServiceListScreen = 'ServiceList',
  ServiceDetailScreen = 'ServiceDetail',
  ServiceListSteps = 'ServiceListSteps',
  ServiceCheckoutSteps = 'ServiceCheckoutSteps',
  MarkdownScreen = 'Markdown',

  // Search
  SearchStack = 'SearchStack',
  PropertySearchLanding = 'PropertySearchLanding',
  PropertySearchScreen = 'PropertySearchScreen',
  PropertyAssetDescription = 'PropertyAssetDescription',
  PropertyFilters = 'PropertyFilters',

  // Main
  Main = 'Main',
  ContactSignup = 'ContactSignup',

  // Contact
  ContactForm = 'ContactForm',
}

// Tab keys
export enum TabKeys {
  Home = 'Home',
  Profile = 'Profile',
}

// To be used as Titles in tab bar
export const ScreensTitles = {
  [ScreensKeys.Home]: 'Home',
  [ScreensKeys.SignUp]: 'Sign Up',
};

export enum OtpNavTypes {
  Login = 'Login',
  SignUp = 'SignUp',
  SocialMedia = 'SocialMedia',
}

export type NavigationScreenProps<S extends Record<string, object | undefined>, T extends keyof S> = {
  navigation: StackNavigationProp<S, T>;
  route: RouteProp<S, T>;
};

export interface IOtpNavProps {
  type: OtpNavTypes;
  title: string;
  countryCode: string;
  phone: string;
  userData?: ISignUpPayload;
  ref: () => FormTextInput | null;
}

export interface IVerificationProps {
  isFromLogin: boolean;
  userData: ISocialUserData;
}

export interface IResetPasswordProps {
  token?: string | number;
  email?: string;
}

// Post Property
export interface IAddPropertyMapProps {
  initialLatitude: number;
  initialLongitude: number;
  primaryTitle: string;
  secondaryTitle: string;
}

export interface IPropertyDetailScreenProps {
  propertyId: number;
  primaryAddress: string;
  secondaryAddress: string;
}

export interface IServiceDataProps {
  serviceId: number;
}

export interface IServiceStepProps {
  id: number;
  name: string;
}

export type MarkdownType = 'visit' | 'verification';

export interface IMarkdownProps {
  title?: string;
  isFrom: MarkdownType;
}

// Property Search Start
export interface IAssetDescriptionProps {
  propertyTermId: number;
  propertyId?: number;
}

export interface IContactProps {
  contactDetail: User;
  propertyTermId: number;
}
