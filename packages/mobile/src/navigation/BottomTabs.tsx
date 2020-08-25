import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { images } from '@homzhub/common/src/assets/images';
import { Image } from '@homzhub/common/src/components';
import Portfolio from '@homzhub/mobile/src/screens/Asset/Portfolio';
import Financials from '@homzhub/mobile/src/screens/Asset/Financials';
import { More } from '@homzhub/mobile/src/screens/Asset/More';
import Dashboard from '@homzhub/mobile/src/screens/Asset/Dashboard';
import MarketTrends from '@homzhub/mobile/src/screens/Asset/Dashboard/MarketTrends';
import PropertyDetailScreen from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetailScreen';
import { IPropertyDetailProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { SearchStack } from '@homzhub/mobile/src/navigation/SearchStack';

export type BottomTabNavigatorParamList = {
  [ScreensKeys.Portfolio]: undefined;
  [ScreensKeys.Financials]: undefined;
  [ScreensKeys.Dashboard]: undefined;
  [ScreensKeys.Search]: undefined;
  [ScreensKeys.More]: undefined;
};

export type DashboardNavigatorParamList = {
  [ScreensKeys.DashboardLandingScreen]: undefined;
  [ScreensKeys.MarketTrends]: undefined;
};

export type PortfolioNavigatorParamList = {
  [ScreensKeys.PortfolioLandingScreen]: undefined;
  [ScreensKeys.PropertyDetailScreen]: IPropertyDetailProps;
};

const BottomTabNavigator = createBottomTabNavigator<BottomTabNavigatorParamList>();
const DashboardNavigator = createStackNavigator<DashboardNavigatorParamList>();
const PortfolioNavigator = createStackNavigator<PortfolioNavigatorParamList>();

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
    </PortfolioNavigator.Navigator>
  );
};

export const BottomTabs = (): React.ReactElement => {
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);
  // Initial Route for guest and logged in user gets decided here
  return (
    <BottomTabNavigator.Navigator
      initialRouteName={isLoggedIn ? ScreensKeys.Dashboard : ScreensKeys.Search}
      lazy
      tabBarOptions={{
        activeTintColor: theme.colors.primaryColor,
      }}
    >
      <BottomTabNavigator.Screen
        name={ScreensKeys.Portfolio}
        component={PortfolioStack}
        options={{
          tabBarLabel: ScreensKeys.Portfolio,
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.portfolio} color={color} size={22} />
          ),
        }}
      />
      <BottomTabNavigator.Screen
        name={ScreensKeys.Financials}
        component={Financials}
        options={{
          tabBarLabel: ScreensKeys.Financials,
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.barChartOutline} color={color} size={22} />
          ),
        }}
      />
      <BottomTabNavigator.Screen
        name={ScreensKeys.Dashboard}
        component={DashboardStack}
        options={{
          tabBarLabel: ScreensKeys.Dashboard,
          tabBarIcon: ({ focused }: { focused: boolean }): React.ReactElement => {
            return (
              <View style={styles.dashboardBump}>
                <Image source={focused ? images.dashboardFocused : images.dashboardUnfocused} />
              </View>
            );
          },
        }}
      />
      <BottomTabNavigator.Screen
        name={ScreensKeys.Search}
        component={SearchStack}
        options={({ route }): any => ({
          tabBarVisible: getTabBarVisibility(route),
          tabBarLabel: ScreensKeys.Search,
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => {
            return <Icon name={icons.search} color={color} size={22} />;
          },
        })}
      />
      <BottomTabNavigator.Screen
        name={ScreensKeys.More}
        component={More}
        options={{
          tabBarLabel: ScreensKeys.More,
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.threeDots} color={color} size={22} />
          ),
        }}
      />
    </BottomTabNavigator.Navigator>
  );
};

// TODO: Need to add type
const getTabBarVisibility = (route: any): boolean => {
  const routeName = route.state ? route.state.routes[route.state.index].name : '';
  const notAllowedRoutes = [ScreensKeys.PropertyAssetDescription, ScreensKeys.ContactForm, ScreensKeys.AuthStack];
  return !notAllowedRoutes.includes(routeName);
};

const styles = StyleSheet.create({
  dashboardBump: {
    borderRadius: 30,
    width: 60,
    height: 60,
    backgroundColor: theme.colors.white,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});