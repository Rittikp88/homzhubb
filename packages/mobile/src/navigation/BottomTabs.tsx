import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getFocusedRouteNameFromRoute } from '@react-navigation/core';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import Focused from '@homzhub/common/src/assets/images/homzhubLogo.svg';
import Unfocused from '@homzhub/common/src/assets/images/homzhubLogoUnfocused.svg';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { AuthStackNavigator } from '@homzhub/mobile/src/navigation/AuthStack';
import Portfolio from '@homzhub/mobile/src/screens/Asset/Portfolio';
import Financials from '@homzhub/mobile/src/screens/Asset/Financials';
import AssetLandingScreen from '@homzhub/mobile/src/screens/Asset/AssetLandingScreen';
import More from '@homzhub/mobile/src/screens/Asset/More';
import Dashboard from '@homzhub/mobile/src/screens/Asset/Dashboard';
import MarketTrends from '@homzhub/mobile/src/screens/Asset/Dashboard/MarketTrends';
import Notifications from '@homzhub/mobile/src/screens/Asset/Dashboard/Notifications';
import PropertyDetailScreen from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/PropertyDetailScreen';
import DefaultLogin from '@homzhub/mobile/src/screens/Asset/DefaultLogin';
import {
  IComingSoon,
  IEditLeaseProps,
  IForgotPasswordProps,
  IManageTenantProps,
  IOtpNavProps,
  IPropertyDetailProps,
  IServicesForSelectAssetParams,
  IUpdateProfileProps,
  IUpdatePropertyProps,
  IVerifyEmail,
  NestedNavigatorParams,
  ScreensKeys,
} from '@homzhub/mobile/src/navigation/interfaces';
import { SearchStack, SearchStackParamList } from '@homzhub/mobile/src/navigation/SearchStack';
import ComingSoonScreen from '@homzhub/mobile/src/screens/ComingSoonScreen';
import PropertyVisits from '@homzhub/mobile/src/screens/Asset/More/PropertyVisits';
import Otp from '@homzhub/mobile/src/screens/Auth/Otp';
import ForgotPassword from '@homzhub/mobile/src/screens/Auth/ForgotPassword';
import UserProfile from '@homzhub/mobile/src/screens/Asset/More/UserProfile';
import UpdateUserProfile from '@homzhub/mobile/src/screens/Asset/More/UpdateUserProfile';
import { ReferEarn } from '@homzhub/mobile/src/screens/Asset/More/ReferEarn';
import Settings from '@homzhub/mobile/src/screens/Asset/More/Settings';
import Support from '@homzhub/mobile/src/screens/Asset/More/Support';
import UpdatePassword from '@homzhub/mobile/src/screens/Asset/More/UpdatePassword';
import ResetPassword from '@homzhub/mobile/src/screens/Auth/ResetPassword';
import SuccessResetPassword from '@homzhub/mobile/src/screens/Auth/SuccessResetPassword';
import ChatScreen from '@homzhub/mobile/src/screens/Asset/More/ChatScreen';
import GroupChatInfo from '@homzhub/mobile/src/screens/Asset/More/GroupChatInfo';
import { SavedProperties } from '@homzhub/mobile/src/screens/Asset/More/SavedProperties';
import { KYCDocuments } from '@homzhub/mobile/src/screens/Asset/More/KYCDocuments';
import { ServicesForSelectedAsset } from '@homzhub/mobile/src/screens/Asset/More/ServicesForSelectedAsset';
import { ValueAddedServices } from '@homzhub/mobile/src/screens/Asset/More/ValueAddedServices';
import Messages from '@homzhub/mobile/src/screens/Asset/More/Messages';
import ManageTenantScreen from '@homzhub/mobile/src/screens/Asset/Portfolio/ManageTenantScreen';
import UpdatePropertyListing from '@homzhub/mobile/src/screens/Asset/Portfolio/UpdatePropertyListing';
import UpdateLeaseTerm from '@homzhub/mobile/src/screens/Asset/Portfolio/UpdateLeaseTerm';
import {
  IAcceptInvitePayload,
  IGetMessageParam,
  IChatScreen,
} from '@homzhub/common/src/domain/repositories/interfaces';

export type BottomTabNavigatorParamList = {
  [ScreensKeys.Portfolio]: NestedNavigatorParams<PortfolioNavigatorParamList>;
  [ScreensKeys.Financials]: NestedNavigatorParams<FinancialsNavigatorParamList>;
  [ScreensKeys.Dashboard]: NestedNavigatorParams<DashboardNavigatorParamList>;
  [ScreensKeys.Search]: NestedNavigatorParams<SearchStackParamList>;
  [ScreensKeys.More]: undefined;
  [ScreensKeys.DefaultLogin]: undefined;
};

export type DashboardNavigatorParamList = {
  [ScreensKeys.DashboardLandingScreen]: undefined;
  [ScreensKeys.ComingSoonScreen]: IComingSoon;
  [ScreensKeys.AssetNotifications]: undefined | { isFromDashboard: boolean };
  [ScreensKeys.PropertyVisits]: { visitId?: number; reviewVisitId?: number };
};

export type PortfolioNavigatorParamList = {
  [ScreensKeys.PortfolioLandingScreen]: IAcceptInvitePayload;
  [ScreensKeys.PropertyDetailScreen]: undefined | IPropertyDetailProps;
  [ScreensKeys.PropertyDetailsNotifications]: undefined;
  [ScreensKeys.PropertyPostLandingScreen]: undefined;
  [ScreensKeys.UpdatePropertyScreen]: IUpdatePropertyProps;
  [ScreensKeys.ManageTenantScreen]: IManageTenantProps;
  [ScreensKeys.UpdateLeaseScreen]: IEditLeaseProps;
};

export type FinancialsNavigatorParamList = {
  [ScreensKeys.FinancialsLandingScreen]: undefined;
};

export type MoreStackNavigatorParamList = {
  [ScreensKeys.MoreScreen]: undefined;
  [ScreensKeys.UserProfileScreen]: IVerifyEmail;
  [ScreensKeys.UpdateUserProfileScreen]: IUpdateProfileProps;
  [ScreensKeys.OTP]: IOtpNavProps;
  [ScreensKeys.SettingsScreen]: undefined;
  [ScreensKeys.PropertyVisits]: { visitId?: number; reviewVisitId?: number };
  [ScreensKeys.MarketTrends]: { isFromDashboard: boolean };
  [ScreensKeys.AssetNotifications]: undefined;
  [ScreensKeys.UpdatePassword]: undefined;
  [ScreensKeys.SupportScreen]: undefined;
  [ScreensKeys.ReferEarn]: undefined;
  [ScreensKeys.ComingSoonScreen]: IComingSoon;
  [ScreensKeys.ForgotPassword]: IForgotPasswordProps;
  [ScreensKeys.SavedPropertiesScreen]: undefined;
  [ScreensKeys.KYC]: undefined;
  [ScreensKeys.ValueAddedServices]: undefined;
  [ScreensKeys.ServicesForSelectedAsset]: IServicesForSelectAssetParams;
  [ScreensKeys.Messages]: undefined;
  [ScreensKeys.ChatScreen]: IChatScreen;
  [ScreensKeys.GroupChatInfo]: IGetMessageParam;
};

const BottomTabNavigator = createBottomTabNavigator<BottomTabNavigatorParamList>();
const DashboardNavigator = createStackNavigator<DashboardNavigatorParamList>();
const PortfolioNavigator = createStackNavigator<PortfolioNavigatorParamList>();
const FinancialsNavigator = createStackNavigator<FinancialsNavigatorParamList>();
const MoreStackNavigator = createStackNavigator<MoreStackNavigatorParamList>();

export const DashboardStack = (): React.ReactElement => {
  return (
    <DashboardNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <DashboardNavigator.Screen name={ScreensKeys.DashboardLandingScreen} component={Dashboard} />
      <DashboardNavigator.Screen name={ScreensKeys.AssetNotifications} component={Notifications} />
      <DashboardNavigator.Screen name={ScreensKeys.ComingSoonScreen} component={ComingSoonScreen} />
      <DashboardNavigator.Screen name={ScreensKeys.PropertyVisits} component={PropertyVisits} />
    </DashboardNavigator.Navigator>
  );
};

export const PortfolioStack = (): React.ReactElement => {
  return (
    <PortfolioNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <PortfolioNavigator.Screen name={ScreensKeys.PortfolioLandingScreen} component={Portfolio} />
      <PortfolioNavigator.Screen name={ScreensKeys.PropertyDetailScreen} component={PropertyDetailScreen} />
      <PortfolioNavigator.Screen name={ScreensKeys.PropertyPostLandingScreen} component={AssetLandingScreen} />
      <PortfolioNavigator.Screen name={ScreensKeys.UpdatePropertyScreen} component={UpdatePropertyListing} />
      <PortfolioNavigator.Screen name={ScreensKeys.ManageTenantScreen} component={ManageTenantScreen} />
      <PortfolioNavigator.Screen name={ScreensKeys.UpdateLeaseScreen} component={UpdateLeaseTerm} />
    </PortfolioNavigator.Navigator>
  );
};

export const FinancialsStack = (): React.ReactElement => {
  return (
    <FinancialsNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <FinancialsNavigator.Screen name={ScreensKeys.FinancialsLandingScreen} component={Financials} />
    </FinancialsNavigator.Navigator>
  );
};
export const MoreStack = (): React.ReactElement => {
  return (
    <MoreStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <MoreStackNavigator.Screen name={ScreensKeys.MoreScreen} component={More} />
      <MoreStackNavigator.Screen name={ScreensKeys.UserProfileScreen} component={UserProfile} />
      <MoreStackNavigator.Screen name={ScreensKeys.UpdateUserProfileScreen} component={UpdateUserProfile} />
      <MoreStackNavigator.Screen name={ScreensKeys.OTP} component={Otp} />
      <MoreStackNavigator.Screen name={ScreensKeys.SettingsScreen} component={Settings} />
      <MoreStackNavigator.Screen name={ScreensKeys.PropertyVisits} component={PropertyVisits} />
      <MoreStackNavigator.Screen name={ScreensKeys.MarketTrends} component={MarketTrends} />
      <MoreStackNavigator.Screen name={ScreensKeys.AssetNotifications} component={Notifications} />
      <MoreStackNavigator.Screen name={ScreensKeys.UpdatePassword} component={UpdatePassword} />
      <MoreStackNavigator.Screen name={ScreensKeys.SupportScreen} component={Support} />
      <AuthStackNavigator.Screen name={ScreensKeys.ResetPassword} component={ResetPassword} />
      <AuthStackNavigator.Screen name={ScreensKeys.SuccessResetPassword} component={SuccessResetPassword} />
      <DashboardNavigator.Screen name={ScreensKeys.ComingSoonScreen} component={ComingSoonScreen} />
      <MoreStackNavigator.Screen name={ScreensKeys.ForgotPassword} component={ForgotPassword} />
      <MoreStackNavigator.Screen name={ScreensKeys.ReferEarn} component={ReferEarn} />
      <MoreStackNavigator.Screen name={ScreensKeys.SavedPropertiesScreen} component={SavedProperties} />
      <MoreStackNavigator.Screen name={ScreensKeys.KYC} component={KYCDocuments} />
      <MoreStackNavigator.Screen name={ScreensKeys.ValueAddedServices} component={ValueAddedServices} />
      <MoreStackNavigator.Screen name={ScreensKeys.ServicesForSelectedAsset} component={ServicesForSelectedAsset} />
      <MoreStackNavigator.Screen name={ScreensKeys.Messages} component={Messages} />
      <MoreStackNavigator.Screen name={ScreensKeys.ChatScreen} component={ChatScreen} />
      <MoreStackNavigator.Screen name={ScreensKeys.GroupChatInfo} component={GroupChatInfo} />
    </MoreStackNavigator.Navigator>
  );
};

export const BottomTabs = (): React.ReactElement => {
  const { t } = useTranslation();
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);
  const dispatch = useDispatch();

  const getTabBarVisibility = (route: any): boolean => {
    const currentRouteName = getFocusedRouteNameFromRoute(route) ?? '';
    const notAllowedRoutes = [
      ScreensKeys.PropertyAssetDescription,
      ScreensKeys.AssetReviews,
      ScreensKeys.ContactForm,
      ScreensKeys.AuthStack,
      ScreensKeys.BookVisit,
      ScreensKeys.PropertyFilters,
      ScreensKeys.PropertyPostStack,
      ScreensKeys.AssetNeighbourhood,
      ScreensKeys.ChatScreen,
      ScreensKeys.GroupChatInfo,
    ];
    return !notAllowedRoutes.includes(currentRouteName as ScreensKeys);
  };

  const initialRoute = isLoggedIn ? ScreensKeys.Dashboard : ScreensKeys.Search;

  return (
    <BottomTabNavigator.Navigator
      initialRouteName={initialRoute}
      tabBarOptions={{
        activeTintColor: theme.colors.primaryColor,
        keyboardHidesTabBar: true,
        labelStyle: {
          marginBottom: 4,
        },
        style: {
          height: PlatformUtils.isIOS() ? theme.viewport.height * 0.1 : 60,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.4,
          shadowRadius: 16,
          elevation: 8,
        },
      }}
    >
      <BottomTabNavigator.Screen
        name={ScreensKeys.Portfolio}
        component={isLoggedIn ? PortfolioStack : DefaultLogin}
        listeners={{
          blur: (): void => {
            dispatch(PortfolioActions.setInitialState());
            dispatch(CommonActions.clearMessages());
          },
        }}
        options={({ route }): any => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: t('assetPortfolio:portfolio'),
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.portfolio} color={color} size={22} />
          ),
        })}
      />
      <BottomTabNavigator.Screen
        name={ScreensKeys.Financials}
        component={isLoggedIn ? FinancialsStack : DefaultLogin}
        options={{
          tabBarLabel: t('assetFinancial:financial'),
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.barChartOutline} color={color} size={22} />
          ),
        }}
      />
      <BottomTabNavigator.Screen
        name={ScreensKeys.Dashboard}
        component={isLoggedIn ? DashboardStack : DefaultLogin}
        options={({ route }): any => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: t('assetDashboard:dashboard'),
          tabBarIcon: ({ focused }: { focused: boolean }): React.ReactElement => {
            return focused ? <Focused /> : <Unfocused />;
          },
        })}
      />
      <BottomTabNavigator.Screen
        name={ScreensKeys.Search}
        component={SearchStack}
        options={({ route }): any => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: t('common:search'),
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => {
            return <Icon name={icons.search} color={color} size={22} />;
          },
        })}
      />
      <BottomTabNavigator.Screen
        name={ScreensKeys.More}
        component={isLoggedIn ? MoreStack : DefaultLogin}
        listeners={{
          blur: (): void => {
            dispatch(CommonActions.clearMessages());
          },
        }}
        options={({ route }): any => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: t('assetMore:more'),
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => {
            return <Icon name={icons.threeDots} color={color} size={22} />;
          },
        })}
      />
    </BottomTabNavigator.Navigator>
  );
};
