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
import Portfolio from '@homzhub/mobile/src/screens/Asset/Portfolio';
import Financials from '@homzhub/mobile/src/screens/Asset/Financials';
import AddRecordScreen from '@homzhub/mobile/src/screens/Asset/Financials/AddRecordScreen';
import More from '@homzhub/mobile/src/screens/Asset/More';
import Dashboard from '@homzhub/mobile/src/screens/Asset/Dashboard';
import MarketTrends from '@homzhub/mobile/src/screens/Asset/Dashboard/MarketTrends';
import Notifications from '@homzhub/mobile/src/screens/Asset/Dashboard/Notifications';
import PropertyDetailScreen from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/PropertyDetailScreen';
import DefaultLogin from '@homzhub/mobile/src/screens/Asset/DefaultLogin';
import { IUpdateProfileProps, NestedNavigatorParams, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import PropertyVisits from '@homzhub/mobile/src/screens/Asset/More/PropertyVisits';
import { SearchStack, SearchStackParamList } from '@homzhub/mobile/src/navigation/SearchStack';
import UserProfile from '@homzhub/mobile/src/screens/Asset/More/UserProfile';
import UpdateUserProfile from '@homzhub/mobile/src/screens/Asset/More/UpdateUserProfile';
import Settings from '@homzhub/mobile/src/screens/Asset/More/Settings';
import UpdatePassword from '@homzhub/mobile/src/screens/Asset/More/UpdatePassword';

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
  [ScreensKeys.MarketTrends]: undefined;
  [ScreensKeys.AssetNotifications]: undefined | { isFromDashboard: boolean };
  [ScreensKeys.PropertyPostStack]: NestedNavigatorParams<PropertyPostStackParamList>;
};

export type PortfolioNavigatorParamList = {
  [ScreensKeys.PortfolioLandingScreen]: undefined;
  [ScreensKeys.PropertyDetailScreen]: undefined;
  [ScreensKeys.PropertyPostStack]: NestedNavigatorParams<PropertyPostStackParamList>;
  [ScreensKeys.PropertyDetailsNotifications]: undefined;
  [ScreensKeys.SearchStack]: NestedNavigatorParams<SearchStackParamList>;
};

export type FinancialsNavigatorParamList = {
  [ScreensKeys.FinancialsLandingScreen]: undefined;
  [ScreensKeys.AddRecordScreen]: undefined;
};

export type MoreStackNavigatorParamList = {
  [ScreensKeys.More]: undefined;
  [ScreensKeys.UserProfileScreen]: undefined;
  [ScreensKeys.UpdateUserProfileScreen]: IUpdateProfileProps;
  [ScreensKeys.SettingsScreen]: undefined;
  [ScreensKeys.PropertyVisits]: undefined;
  [ScreensKeys.MarketTrends]: undefined;
  [ScreensKeys.AssetNotifications]: undefined;
  [ScreensKeys.SearchStack]: NestedNavigatorParams<SearchStackParamList>;
  [ScreensKeys.UpdatePassword]: undefined;
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
      <DashboardNavigator.Screen name={ScreensKeys.MarketTrends} component={MarketTrends} />
      <DashboardNavigator.Screen name={ScreensKeys.AssetNotifications} component={Notifications} />
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
      <PortfolioNavigator.Screen name={ScreensKeys.SearchStack} component={SearchStack} />
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
      <FinancialsNavigator.Screen name={ScreensKeys.AddRecordScreen} component={AddRecordScreen} />
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
      <MoreStackNavigator.Screen name={ScreensKeys.More} component={More} />
      <MoreStackNavigator.Screen name={ScreensKeys.UserProfileScreen} component={UserProfile} />
      <MoreStackNavigator.Screen name={ScreensKeys.UpdateUserProfileScreen} component={UpdateUserProfile} />
      <MoreStackNavigator.Screen name={ScreensKeys.SettingsScreen} component={Settings} />
      <MoreStackNavigator.Screen name={ScreensKeys.PropertyVisits} component={PropertyVisits} />
      <DashboardNavigator.Screen name={ScreensKeys.MarketTrends} component={MarketTrends} />
      <DashboardNavigator.Screen name={ScreensKeys.AssetNotifications} component={Notifications} />
      <MoreStackNavigator.Screen name={ScreensKeys.SearchStack} component={SearchStack} />
      <MoreStackNavigator.Screen name={ScreensKeys.UpdatePassword} component={UpdatePassword} />
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

  // TODO: Need to add type
  const getTabBarVisibility = (route: any): boolean => {
    const currentRouteName = getFocusedRouteNameFromRoute(route) ?? '';
    const notAllowedRoutes = [
      ScreensKeys.PropertyAssetDescription,
      ScreensKeys.ContactForm,
      ScreensKeys.AuthStack,
      ScreensKeys.BookVisit,
      ScreensKeys.PropertyFilters,
    ];
    return !notAllowedRoutes.includes(currentRouteName as ScreensKeys);
  };

  return (
    <BottomTabNavigator.Navigator
      initialRouteName={isLoggedIn ? ScreensKeys.Dashboard : ScreensKeys.Search}
      lazy
      tabBarOptions={{
        activeTintColor: theme.colors.primaryColor,
        keyboardHidesTabBar: true,
        style: {
          borderTopWidth: 2,
          paddingTop: PlatformUtils.isIOS() ? 8 : 3,
          paddingBottom: PlatformUtils.isIOS() ? 30 : 4,
          height: PlatformUtils.isIOS() ? 90 : 60,
          shadowColor: theme.colors.shadow,
          shadowOpacity: 1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 0 },
        },
      }}
    >
      <BottomTabNavigator.Screen
        name={ScreensKeys.Portfolio}
        component={isLoggedIn ? PortfolioStack : DefaultLogin}
        listeners={{
          blur: (): IFluxStandardAction => dispatch(PortfolioActions.setInitialState()),
        }}
        options={{
          tabBarLabel: t('assetPortfolio:portfolio'),
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.portfolio} color={color} size={22} />
          ),
        }}
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
        options={{
          tabBarLabel: t('assetDashboard:dashboard'),
          tabBarIcon: ({ focused }: { focused: boolean }): React.ReactElement => {
            return focused ? <Focused /> : <Unfocused />;
          },
        }}
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
        options={{
          tabBarLabel: t('assetMore:more'),
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.threeDots} color={color} size={22} />
          ),
        }}
      />
    </BottomTabNavigator.Navigator>
  );
};
