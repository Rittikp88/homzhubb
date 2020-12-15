import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ISocialUserData } from '@homzhub/common/src/assets/constants';
import { UpdateUserFormTypes } from '@homzhub/mobile/src/screens/Asset/More/UpdateUserProfile';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { User } from '@homzhub/common/src/domain/models/User';
import { GooglePlaceDetail } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

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
  DefaultLogin = 'DefaultLogin',
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
  BottomTabs = 'BottomTabs',
  PropertyPostStack = 'PropertyPostStack',

  // LoggedIn Bottom Tabs
  Portfolio = 'Portfolio',
  Financials = 'Financials',
  Dashboard = 'Dashboard',
  Search = 'Search',
  More = 'More',

  // Dashboard Stack
  DashboardLandingScreen = 'DashboardLandingScreen',
  MarketTrends = 'MarketTrends',
  PropertyVisits = 'PropertyVisits',
  AssetNotifications = 'AssetNotifications',

  // Portfolio Stack
  PortfolioLandingScreen = 'PortfolioLandingScreen',
  PropertyDetailScreen = 'PropertyDetailScreen',
  PropertyDetailsNotifications = 'PropertyDetailsNotifications',

  // Financials Stack
  FinancialsLandingScreen = 'FinancialsLandingScreen',
  AddRecordScreen = 'AddRecordScreen',

  // PropertyPostStack
  AssetLocationSearch = 'AssetLocationSearch',
  AssetLocationMap = 'AssetLocationMap',
  PostAssetDetails = 'PostAssetDetails',
  PropertyDetailsScreen = 'PropertyDetails',
  AddProperty = 'AddProperty',
  AssetPlanSelection = 'AssetPlanSelection',
  AssetLeaseListing = 'AssetLeaseListing',
  MarkdownScreen = 'Markdown',

  // Search Stack
  PropertySearchLanding = 'PropertySearchLanding',
  PropertySearchScreen = 'PropertySearchScreen',
  PropertyAssetDescription = 'PropertyAssetDescription',
  AssetNeighbourhood = 'AssetNeighbourhood',
  PropertyFilters = 'PropertyFilters',
  ContactSignup = 'ContactSignup',
  ContactForm = 'ContactForm',
  BookVisit = 'BookVisit',

  // Common Screens
  ComingSoonScreen = 'ComingSoonScreen',
  WebViewScreen = 'WebViewScreen',

  // More Stack
  MoreScreen = 'MoreScreen',
  UserProfileScreen = 'UserProfileScreen',
  UpdateUserProfileScreen = 'UpdateUserProfileScreen',
  SettingsScreen = 'SettingsScreen',
  UpdatePassword = 'UpdatePassword',
  SupportScreen = 'SupportScreen',
  ReferEarn = 'ReferEarn',
}

export enum OtpNavTypes {
  Login = 'Login',
  SignUp = 'SignUp',
  SocialMedia = 'SocialMedia',
  UpdateProfileByEmailPhoneOtp = 'UpdateProfileByEmailPhoneOtp',
  UpdateProfileByOtp = 'UpdateProfileByOtp',
}

export interface IScreenCallback {
  onCallback?: () => void;
}

export interface IOtpNavProps extends IScreenCallback {
  type: OtpNavTypes;
  title: string;
  countryCode: string;
  otpSentTo: string;
  email?: string;
  userData?: ISignUpPayload;
  updateProfileCallback?: (phoneOtp: string, emailOtp?: string) => void;
}

export interface IVerificationProps extends IScreenCallback {
  isFromLogin: boolean;
  userData: ISocialUserData;
}

export interface IResetPasswordProps extends IScreenCallback {
  verification_id: string;
}

export interface IForgotPasswordProps extends IScreenCallback {
  isFromMore?: boolean;
}

// Post Property
export interface IAssetLocationMapProps {
  placeData: GooglePlaceDetail;
}

export interface IPostAssetDetailsProps {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  countryIsoCode: string;
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
  isPreview?: boolean;
}

export interface IContactProps {
  contactDetail: User | null;
  propertyTermId: number;
}

export interface IBookVisitProps {
  propertyTermId?: number;
  sale_listing_id?: number;
  lease_listing_id?: number;
  isReschedule?: boolean;
  userId?: number;
}

// Webview
export interface IWebviewProps {
  url: string;
  trendId?: number;
}

// User Profile
export interface IUpdateProfileProps {
  title?: string;
  formType?: UpdateUserFormTypes;
}

export interface IComingSoon {
  title: string;
  tabHeader: string;
}

export interface IVerifyEmail {
  verification_id: string;
}

export interface IPropertyDetailProps {
  isFromDashboard?: boolean;
  isFromTenancies?: boolean;
  tabKey?: Tabs;
}
