import React from 'react';
import { StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/core';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import Focused from '@homzhub/common/src/assets/images/homzhubLogo.svg';
import Unfocused from '@homzhub/common/src/assets/images/homzhubLogoUnfocused.svg';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
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
  IAssetDescriptionProps,
  IComingSoon,
  IForgotPasswordProps,
  IOtpNavProps,
  IPropertyDetailProps,
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
import AssetDescription from '@homzhub/mobile/src/screens/Asset/Search/AssetDescription';
import ResetPassword from '@homzhub/mobile/src/screens/Auth/ResetPassword';
import SuccessResetPassword from '@homzhub/mobile/src/screens/Auth/SuccessResetPassword';
import { SavedProperties } from '@homzhub/mobile/src/screens/Asset/More/SavedProperties';
import { KYCDocuments } from '@homzhub/mobile/src/screens/Asset/More/KYCDocuments';
import UpdatePropertyListing from '@homzhub/mobile/src/screens/Asset/Portfolio/UpdatePropertyListing';

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
  [ScreensKeys.PropertyVisits]: undefined | { visitId: number };
  [ScreensKeys.PropertyAssetDescription]: IAssetDescriptionProps;
};

export type PortfolioNavigatorParamList = {
  [ScreensKeys.PortfolioLandingScreen]: undefined;
  [ScreensKeys.PropertyDetailScreen]: undefined | IPropertyDetailProps;
  [ScreensKeys.PropertyDetailsNotifications]: undefined;
  [ScreensKeys.PropertyPostLandingScreen]: undefined;
  [ScreensKeys.UpdatePropertyScreen]: IUpdatePropertyProps;
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
  [ScreensKeys.PropertyVisits]: undefined;
  [ScreensKeys.MarketTrends]: { isFromDashboard: boolean };
  [ScreensKeys.AssetNotifications]: undefined;
  [ScreensKeys.UpdatePassword]: undefined;
  [ScreensKeys.SupportScreen]: undefined;
  [ScreensKeys.ReferEarn]: undefined;
  [ScreensKeys.ComingSoonScreen]: IComingSoon;
  [ScreensKeys.ForgotPassword]: IForgotPasswordProps;
  [ScreensKeys.SavedPropertiesScreen]: undefined;
  [ScreensKeys.KYC]: undefined;
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
      <DashboardNavigator.Screen name={ScreensKeys.PropertyAssetDescription} component={AssetDescription} />
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
    </MoreStackNavigator.Navigator>
  );
};

export const BottomTabs = (): React.ReactElement => {
  const { t } = useTranslation();
  const routeName = getFocusedRouteNameFromRoute(useRoute()) ?? ScreensKeys.Dashboard;
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);
  const dispatch = useDispatch();
  // Initial Route for guest and logged in user gets decided here
  if (PlatformUtils.isAndroid()) {
    if (isLoggedIn && routeName !== ScreensKeys.Search) {
      StatusBar.setBackgroundColor(theme.colors.primaryColor);
    } else {
      StatusBar.setBackgroundColor(theme.colors.white);
    }
  }

  const getTabBarVisibility = (route: any): boolean => {
    const currentRouteName = getFocusedRouteNameFromRoute(route) ?? '';
    const notAllowedRoutes = [
      ScreensKeys.PropertyAssetDescription,
      ScreensKeys.ContactForm,
      ScreensKeys.AuthStack,
      ScreensKeys.BookVisit,
      ScreensKeys.PropertyFilters,
      ScreensKeys.PropertyPostStack,
      ScreensKeys.AssetNeighbourhood,
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
          blur: (): IFluxStandardAction => dispatch(PortfolioActions.setInitialState()),
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
