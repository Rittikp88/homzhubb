import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ISocialUserData } from '@homzhub/common/src/assets/constants';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { User } from '@homzhub/common/src/domain/models/User';

export type NavigationScreenProps<S extends Record<string, object | undefined>, T extends keyof S> = {
  navigation: StackNavigationProp<S, T>;
  route: RouteProp<S, T>;
};

export type NestedNavigatorParams<ParamList> = {
  [K in keyof ParamList]: undefined extends ParamList[K]
    ? { screen: K; params?: ParamList[K] }
    : { screen: K; params: ParamList[K] };
}[keyof ParamList];

// Route keys
export enum ScreensKeys {
  // Stacks
  AuthStack = 'AuthStack',
  SearchStack = 'SearchStack',

  // Main Stack
  OnBoarding = 'OnBoarding',
  GettingStarted = 'GettingStarted',

  // Auth Stack Flow
  SignUp = 'SignUp',
  MobileVerification = 'MobileVerification',
  Login = 'Login',
  EmailLogin = 'EmailLogin',
  OTP = 'OTP',
  ForgotPassword = 'ForgotPassword',
  ResetPassword = 'ResetPassword',
  SuccessResetPassword = 'SuccessResetPassword',

  // App Navigator Logged In
  PropertyPostLandingScreen = 'PropertyPost',
  LoggedInBottomTabs = 'LoggedInBottomTabs',
  PropertyPostStack = 'PropertyPostStack',

  // LoggedIn Bottom Tabs
  Portfolio = 'Portfolio',
  Financials = 'Financials',
  Dashboard = 'Dashboard',
  Search = 'Search',
  More = 'More',

  // PropertyPostStack
  PostPropertySearch = 'PostPropertySearch',
  PostPropertyMap = 'PostPropertyMap',
  PropertyDetailsScreen = 'PropertyDetails',
  RentServicesScreen = 'RentServices',
  ServiceListScreen = 'ServiceList',
  ServiceDetailScreen = 'ServiceDetail',
  ServiceListSteps = 'ServiceListSteps',
  ServiceCheckoutSteps = 'ServiceCheckoutSteps',
  MarkdownScreen = 'Markdown',

  // Search Stack
  PropertySearchLanding = 'PropertySearchLanding',
  PropertySearchScreen = 'PropertySearchScreen',
  PropertyAssetDescription = 'PropertyAssetDescription',
  PropertyFilters = 'PropertyFilters',
  ContactSignup = 'ContactSignup',
  ContactForm = 'ContactForm',
}

export enum OtpNavTypes {
  Login = 'Login',
  SignUp = 'SignUp',
  SocialMedia = 'SocialMedia',
}

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
