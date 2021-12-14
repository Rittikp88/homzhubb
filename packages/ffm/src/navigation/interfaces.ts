import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { OtpNavTypes } from '@homzhub/mobile/src/navigation/interfaces';

export type NavigationScreenProps<S extends Record<string, object | undefined>, T extends keyof S> = {
  navigation: StackNavigationProp<S, T>;
  route: RouteProp<S, T>;
};

export type NestedNavigatorParams<ParamList> = {
  [K in keyof ParamList]: undefined extends ParamList[K]
    ? { screen: K; params?: ParamList[K] }
    : { screen: K; params: ParamList[K] };
}[keyof ParamList];

export enum ScreenKeys {
  // Common
  OnBoarding = 'OnBoarding',
  // Auth
  Login = 'LoginScreen',
  EmailLogin = 'EmailLoginScreen',
  Signup = 'SignupScreen',
  WorkLocations = 'AddWorkLocations',
  MobileVerification = 'MobileVerification',

  // BottomTabs
  BottomTab = 'BottomTab',
  Dashboard = 'Dashboard',
  SiteVisits = 'SiteVisits',
  Requests = 'Requests',
  Supplies = 'Supplies',
  More = 'More',

  // Visit
  SiteVisitDashboard = 'SiteVisitDashboard',
  VisitForm = 'VisitForm',
  VisitDetail = 'VisitDetail',
  FeedbackForm = 'FeedbackForm',

  // Reports
  ReportDashboard = 'ReportDashboard',
  InspectionSelection = 'InspectionSelection',
  ReportLocationMap = 'ReportLocationMap',

  // More
  MoreScreen = 'MoreScreen',
}

export interface IVerification {
  type: OtpNavTypes;
  title: string;
  countryCode: string;
  otpSentTo: string;
  userData?: ISignUpPayload;
}

export interface IVisitParam {
  startDate: string;
  comment: string;
}

export interface IFeedbackParam {
  visitId: number;
  isSubmitted: boolean;
  feedbackId: number | null;
}

export interface IVisitDetailParam {
  visitId: number;
}

export interface ILocationParam {
  placeData: GooglePlaceDetail;
}