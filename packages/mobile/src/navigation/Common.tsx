import React from 'react';
import MarketTrends from '@homzhub/mobile/src/screens/Asset/Dashboard/MarketTrends';
import Notifications from '@homzhub/mobile/src/screens/Asset/Dashboard/Notifications';
import AddRecordScreen from '@homzhub/mobile/src/screens/Asset/Financials/AddRecordScreen';
import { MarkdownView } from '@homzhub/mobile/src/screens/Asset/MarkdownView';
import PropertyVisits from '@homzhub/mobile/src/screens/Asset/More/PropertyVisits';
import AcceptOffer from '@homzhub/mobile/src/screens/Asset/More/Offers/AcceptOffer';
import CreateLease from '@homzhub/mobile/src/screens/Asset/More/Offers/CreateLease';
import CancelOffer from '@homzhub/mobile/src/screens/Asset/More/Offers/CancelOffer';
import ProspectProfile from '@homzhub/mobile/src/screens/Asset/More/Offers/ProspectProfile';
import RejectOffer from '@homzhub/mobile/src/screens/Asset/More/Offers/RejectOffer';
import SubmitOfferForm from '@homzhub/mobile/src/screens/Asset/More/Offers/SubmitOfferForm';
import AssetDescription from '@homzhub/mobile/src/screens/Asset/Search/AssetDescription';
import BookVisit from '@homzhub/mobile/src/screens/Asset/Search/BookVisit';
import ServiceTicket from '@homzhub/mobile/src/screens/Asset/More/ServiceTickets';
import ApproveQuote from '@homzhub/mobile/src/screens/Asset/More/ServiceTickets/ApproveQuote';
import ChatScreen from '@homzhub/mobile/src/screens/Asset/More/ChatScreen';
import ServiceTicketForm from '@homzhub/mobile/src/screens/Asset/More/ServiceTickets/ServiceTicketForm';
import ServiceTicketDetails from '@homzhub/mobile/src/screens/Asset/More/ServiceTickets/ServiceTicketDetails';
import SubmitQuote from '@homzhub/mobile/src/screens/Asset/More/ServiceTickets/SubmitQuote';
import Support from '@homzhub/mobile/src/screens/Asset/More/Support';
import WorkCompleted from '@homzhub/mobile/src/screens/Asset/More/ServiceTickets/WorkCompleted';
import PropertyDetailScreen from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/PropertyDetailScreen';
import AssetPlanSelection from '@homzhub/mobile/src/screens/Asset/Record/AssetPlanSelection';
import UserProfile from '@homzhub/mobile/src/screens/Asset/More/UserProfile';
import UpdatePassword from '@homzhub/mobile/src/screens/Asset/More/UpdatePassword';
import UpdateUserProfile from '@homzhub/mobile/src/screens/Asset/More/UpdateUserProfile';
import ForgotPassword from '@homzhub/mobile/src/screens/Auth/ForgotPassword';
import Otp from '@homzhub/mobile/src/screens/Auth/Otp';
import ResetPassword from '@homzhub/mobile/src/screens/Auth/ResetPassword';
import SuccessResetPassword from '@homzhub/mobile/src/screens/Auth/SuccessResetPassword';
import ComingSoonScreen from '@homzhub/mobile/src/screens/ComingSoonScreen';
import { WebViewScreen } from '@homzhub/mobile/src/screens/common/WebViewScreen';
import { IChatScreen, IServiceTicketForm } from '@homzhub/common/src/domain/repositories/interfaces';
import {
  IAddRecordProps,
  IAssetDescriptionProps,
  IBookVisitProps,
  IComingSoon,
  IForgotPasswordProps,
  IMarkdownProps,
  IOtpNavProps,
  IPlanSelectionParam,
  IPropertyDetailProps,
  IResetPasswordProps,
  IUpdateProfileProps,
  IVerifyEmail,
  IWebviewProps,
  ScreensKeys,
} from '@homzhub/mobile/src/navigation/interfaces';

export type CommonParamList = {
  [ScreensKeys.ComingSoonScreen]: IComingSoon;
  [ScreensKeys.PropertyDetailScreen]: undefined | IPropertyDetailProps;
  [ScreensKeys.AssetNotifications]: undefined | { isFromDashboard: boolean };
  [ScreensKeys.PropertyVisits]: { visitId?: number; reviewVisitId?: number };
  [ScreensKeys.ServiceTicketScreen]: undefined | { isFromDashboard: boolean };
  [ScreensKeys.MarketTrends]: { isFromDashboard: boolean };
  [ScreensKeys.PropertyAssetDescription]: IAssetDescriptionProps;
  [ScreensKeys.AddServiceTicket]: IServiceTicketForm;
  [ScreensKeys.AddRecordScreen]: IAddRecordProps;
  [ScreensKeys.WebViewScreen]: IWebviewProps;
  [ScreensKeys.BookVisit]: IBookVisitProps;
  [ScreensKeys.ServiceTicketDetail]: undefined;
  [ScreensKeys.SubmitQuote]: undefined;
  [ScreensKeys.ApproveQuote]: undefined;
  [ScreensKeys.WorkCompleted]: undefined;
  [ScreensKeys.SubmitOffer]: undefined;
  [ScreensKeys.CreateLease]: undefined;
  [ScreensKeys.AcceptOffer]: undefined;
  [ScreensKeys.RejectOffer]: undefined;
  [ScreensKeys.CancelOffer]: undefined;
  [ScreensKeys.MarkdownScreen]: IMarkdownProps;
  [ScreensKeys.ProspectProfile]: IAssetDescriptionProps;
  [ScreensKeys.UserProfileScreen]: IVerifyEmail;
  [ScreensKeys.UpdateUserProfileScreen]: IUpdateProfileProps;
  [ScreensKeys.OTP]: IOtpNavProps;
  [ScreensKeys.UpdatePassword]: undefined;
  [ScreensKeys.ForgotPassword]: IForgotPasswordProps;
  [ScreensKeys.SuccessResetPassword]: undefined | IForgotPasswordProps;
  [ScreensKeys.OTP]: IOtpNavProps;
  [ScreensKeys.ResetPassword]: IResetPasswordProps;
  [ScreensKeys.SupportScreen]: { isFromDashboard?: boolean };
  [ScreensKeys.ChatScreen]: IChatScreen;
  [ScreensKeys.AssetPlanSelection]: undefined | IPlanSelectionParam;
};

/**
 * Common Screen for multiple stacks
 * @param Stack
 */
export const getCommonScreen = (Stack: any): React.ReactElement => {
  return (
    <>
      <Stack.Screen name={ScreensKeys.ComingSoonScreen} component={ComingSoonScreen} />
      <Stack.Screen name={ScreensKeys.PropertyDetailScreen} component={PropertyDetailScreen} />
      <Stack.Screen name={ScreensKeys.PropertyAssetDescription} component={AssetDescription} />
      <Stack.Screen name={ScreensKeys.AddServiceTicket} component={ServiceTicketForm} />
      <Stack.Screen name={ScreensKeys.AssetNotifications} component={Notifications} />
      <Stack.Screen name={ScreensKeys.AddRecordScreen} component={AddRecordScreen} />
      <Stack.Screen name={ScreensKeys.PropertyVisits} component={PropertyVisits} />
      <Stack.Screen name={ScreensKeys.WebViewScreen} component={WebViewScreen} />
      <Stack.Screen name={ScreensKeys.ServiceTicketDetail} component={ServiceTicketDetails} />
      <Stack.Screen name={ScreensKeys.ServiceTicketScreen} component={ServiceTicket} />
      <Stack.Screen name={ScreensKeys.SubmitQuote} component={SubmitQuote} />
      <Stack.Screen name={ScreensKeys.ApproveQuote} component={ApproveQuote} />
      <Stack.Screen name={ScreensKeys.WorkCompleted} component={WorkCompleted} />
      <Stack.Screen name={ScreensKeys.CreateLease} component={CreateLease} />
      <Stack.Screen name={ScreensKeys.AcceptOffer} component={AcceptOffer} />
      <Stack.Screen name={ScreensKeys.RejectOffer} component={RejectOffer} />
      <Stack.Screen name={ScreensKeys.CancelOffer} component={CancelOffer} />
      <Stack.Screen name={ScreensKeys.BookVisit} component={BookVisit} />
      <Stack.Screen name={ScreensKeys.MarketTrends} component={MarketTrends} />
      <Stack.Screen name={ScreensKeys.SubmitOffer} component={SubmitOfferForm} />
      <Stack.Screen name={ScreensKeys.MarkdownScreen} component={MarkdownView} />
      <Stack.Screen name={ScreensKeys.ProspectProfile} component={ProspectProfile} />
      <Stack.Screen name={ScreensKeys.UserProfileScreen} component={UserProfile} />
      <Stack.Screen name={ScreensKeys.UpdateUserProfileScreen} component={UpdateUserProfile} />
      <Stack.Screen name={ScreensKeys.OTP} component={Otp} />
      <Stack.Screen name={ScreensKeys.UpdatePassword} component={UpdatePassword} />
      <Stack.Screen name={ScreensKeys.ResetPassword} component={ResetPassword} />
      <Stack.Screen name={ScreensKeys.SuccessResetPassword} component={SuccessResetPassword} />
      <Stack.Screen name={ScreensKeys.ForgotPassword} component={ForgotPassword} />
      <Stack.Screen name={ScreensKeys.SupportScreen} component={Support} />
      <Stack.Screen name={ScreensKeys.ChatScreen} component={ChatScreen} />
      <Stack.Screen name={ScreensKeys.AssetPlanSelection} component={AssetPlanSelection} />
    </>
  );
};