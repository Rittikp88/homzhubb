import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { UpdateUserFormTypes } from '@homzhub/mobile/src/screens/Asset/More/UpdateUserProfile';
import {
  IClosureReasonPayload,
  IListingParam,
  ISignUpPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { User } from '@homzhub/common/src/domain/models/User';
import { GooglePlaceDetail } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IAmenitiesIcons } from '@homzhub/common/src/domain/models/Search';
import { IGetServicesByIds } from '@homzhub/common/src/domain/models/ValueAddedService';
import { Tabs } from '@homzhub/common/src/constants/Tabs';
import { ISocialUserData } from '@homzhub/common/src/constants/SocialAuthProviders';

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
  UpdatePropertyScreen = 'UpdatePropertyScreen',
  ManageTenantScreen = 'ManageTenantScreen',
  UpdateLeaseScreen = 'UpdateLeaseScreen',
  AssetReviewScreen = 'AssetReviewScreen',
  AssetFinancialScreen = 'AssetFinancialScreen',
  DocumentScreen = 'DocumentScreen',
  TenantHistoryScreen = 'TenantHistoryScreen',
  AssetDetailScreen = 'AssetDetailScreen',

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
  AssetListing = 'AssetListing',
  MarkdownScreen = 'Markdown',

  // Search Stack
  PropertySearchLanding = 'PropertySearchLanding',
  PropertySearchScreen = 'PropertySearchScreen',
  PropertyAssetDescription = 'PropertyAssetDescription',
  AssetReviews = 'AssetReviews',
  AssetNeighbourhood = 'AssetNeighbourhood',
  PropertyFilters = 'PropertyFilters',
  ContactSignup = 'ContactSignup',
  ContactForm = 'ContactForm',
  BookVisit = 'BookVisit',

  // Common Screens
  ComingSoonScreen = 'ComingSoonScreen',
  WebViewScreen = 'WebViewScreen',
  LandingScreen = 'LandingScreen',

  // More Stack
  MoreScreen = 'MoreScreen',
  UserProfileScreen = 'UserProfileScreen',
  UpdateUserProfileScreen = 'UpdateUserProfileScreen',
  SettingsScreen = 'SettingsScreen',
  UpdatePassword = 'UpdatePassword',
  SupportScreen = 'SupportScreen',
  ReferEarn = 'ReferEarn',
  SavedPropertiesScreen = 'SavedPropertiesScreen',
  KYC = 'KYC',
  ValueAddedServices = 'ValueAddedServices',
  ServicesForSelectedAsset = 'ServicesForSelectedAsset',
  SubscriptionPayment = 'SubscriptionPayment',
  ServicesDashboard = 'ServicesDashboard',
  AddPropertyImage = 'AddPropertyImage',

  // Messages
  Messages = 'Messages',
  ChatScreen = 'ChatScreen',
  GroupChatInfo = 'GroupChatInfo',

  // Tickets
  AddServiceTicket = 'AddServiceTicket',
  ServiceTicketScreen = 'ServiceTicketScreen',
  ServiceTicketDetail = 'ServiceTicketDetail',
  SubmitQuote = 'SubmitQuote',
  ApproveQuote = 'ApproveQuote',
  WorkCompleted = 'WorkCompleted',

  // Offers
  ProspectProfile = 'ProspectProfile',
  SubmitOffer = 'SubmitOffer',
  PropertyOfferList = 'PropertyOfferList',
  OfferDetail = 'OfferDetail',
  AcceptOffer = 'AcceptOffer',
  RejectOffer = 'RejectOffer',
  CancelOffer = 'CancelOffer',
  CreateLease = 'CreateLease',
}

export enum OtpNavTypes {
  Login = 'Login',
  SignUp = 'SignUp',
  SocialMedia = 'SocialMedia',
  UpdateProfileByEmailPhoneOtp = 'UpdateProfileByEmailPhoneOtp',
  UpdateProfileByOtp = 'UpdateProfileByOtp',
}

export enum UpdatePropertyFormTypes {
  CancelListing = 'CANCEL_LISTING',
  TerminateListing = 'TERMINATE_LISTING',
  RenewListing = 'RENEW_LISTING',
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
  socialUserData?: ISocialUserData;
  updateProfileCallback?: (phoneOtp: string, emailOtp?: string) => void;
}

export interface IVerificationProps extends IScreenCallback {
  isFromLogin: boolean;
  userData: ISocialUserData;
}

export interface IResetPasswordProps extends IScreenCallback {
  verification_id: string;
  invite_id?: string;
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
  editData?: boolean;
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

// Add Financial Records
export interface IAddRecordProps {
  assetId?: number;
  isFromDashboard?: boolean;
  screenTitle?: string;
  isEditFlow?: boolean;
  transactionId?: number;
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
  screenTitle?: string;
}

export interface IPropertyDetailProps {
  isFromDashboard?: boolean;
  isFromTenancies?: boolean;
  tabKey?: Tabs;
}

export interface IUpdatePropertyProps {
  formType: UpdatePropertyFormTypes;
  payload: IClosureReasonPayload;
  param?: IListingParam;
  assetDetail: Asset;
}

export interface IManageTenantProps {
  assetDetail: Asset;
}

export interface IEditLeaseProps {
  transactionId: number;
  assetGroup: string;
  user: User;
}

export interface ISignUpParams extends IScreenCallback {
  referralCode?: string;
}

export interface IBadgeInfo {
  title: string;
  color: string;
}

export interface IServicesForSelectAssetParams {
  propertyId: number;
  serviceByIds: IGetServicesByIds;
  badgeInfo: IBadgeInfo;
  amenities: IAmenitiesIcons[];
  assetType: string;
  projectName: string;
  address: string;
  flag: React.ReactElement;
}

export interface IPlanSelectionParam {
  isFromPortfolio?: boolean;
  isSubleased?: boolean;
  leaseUnit?: number;
  startDate?: string;
}

export interface IListingNavParam {
  previousScreen: string;
  isEditFlow?: boolean;
  leaseUnit?: number;
  startDate?: string;
}

export interface ICommonNavProps {
  isFromDashboard?: boolean;
  isFromPortfolio?: boolean;
  isFromTenancies?: boolean;
  screenTitle?: string;
  propertyId?: number;
}

export interface IVisitNavParam extends ICommonNavProps {
  visitId?: number;
  reviewVisitId?: number;
}

export interface IChatScreen extends ICommonNavProps {
  groupId?: number | string;
  isFromOffers?: boolean;
  isFromNotifications?: boolean;
}

export interface IDetailNavParam extends ICommonNavProps {
  property: Asset;
}

export interface IReviewNavParam extends ICommonNavProps {
  saleListingId: number | null;
  leaseListingId: number | null;
}

export interface IPropertyImageParam {
  assetId: number;
}
