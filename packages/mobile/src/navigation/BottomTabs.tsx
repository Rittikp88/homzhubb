import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/core';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { images } from '@homzhub/common/src/assets/images';
import { Divider, Image, Text } from '@homzhub/common/src/components';
import Portfolio from '@homzhub/mobile/src/screens/Asset/Portfolio';
import Financials from '@homzhub/mobile/src/screens/Asset/Financials';
import AddRecordScreen from '@homzhub/mobile/src/screens/Asset/Financials/AddRecordScreen';
import { More } from '@homzhub/mobile/src/screens/Asset/More';
import Dashboard from '@homzhub/mobile/src/screens/Asset/Dashboard';
import MarketTrends from '@homzhub/mobile/src/screens/Asset/Dashboard/MarketTrends';
import Notifications from '@homzhub/mobile/src/screens/Asset/Dashboard/Notifications';
import PropertyDetailScreen from '@homzhub/mobile/src/screens/Asset/Portfolio/PropertyDetail/PropertyDetailScreen';
import DefaultLogin from '@homzhub/mobile/src/screens/Asset/DefaultLogin';
import { ILandingScreenProps, NestedNavigatorParams, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { SearchStack, SearchStackParamList } from '@homzhub/mobile/src/navigation/SearchStack';

const MORE_STACK = [
  {
    id: 1,
    title: 'Profile',
    icon: icons.user,
  },
  {
    id: 2,
    title: 'Notifications',
    icon: icons.alert,
  },
  {
    id: 3,
    title: 'Documents',
    icon: icons.documents,
  },
  {
    id: 4,
    title: 'Tickets',
    icon: icons.ticket,
  },
  {
    id: 5,
    title: 'New launches',
    icon: icons.newLaunch,
  },
  {
    id: 6,
    title: 'Value Added Services',
    icon: icons.settingOutline,
  },
  {
    id: 7,
    title: 'Saved Properties',
    icon: icons.heartOutline,
  },
  {
    id: 8,
    title: 'Market Trends',
    icon: icons.increase,
  },
  {
    id: 9,
    title: 'Support',
    icon: icons.headset,
  },
  {
    id: 10,
    title: 'Settings',
    icon: icons.setting,
  },
  {
    id: 11,
    title: 'Refer a friend',
    icon: icons.refer,
  },
  {
    id: 12,
    title: 'Payment Methods',
    icon: icons.payment,
  },
  {
    id: 13,
    title: 'Logout',
    icon: icons.logOut,
  },
];

export type BottomTabNavigatorParamList = {
  [ScreensKeys.Portfolio]: NestedNavigatorParams<PortfolioNavigatorParamList>;
  [ScreensKeys.Financials]: NestedNavigatorParams<FinancialsNavigatorParamList>;
  [ScreensKeys.Dashboard]: undefined;
  [ScreensKeys.Search]: NestedNavigatorParams<SearchStackParamList>;
  [ScreensKeys.More]: undefined;
  [ScreensKeys.DefaultLogin]: undefined;
};

export type DashboardNavigatorParamList = {
  [ScreensKeys.DashboardLandingScreen]: undefined;
  [ScreensKeys.MarketTrends]: undefined;
  [ScreensKeys.AssetNotifications]: undefined;
};

export type PortfolioNavigatorParamList = {
  [ScreensKeys.PortfolioLandingScreen]: ILandingScreenProps;
  [ScreensKeys.PropertyDetailScreen]: undefined;
  [ScreensKeys.PropertyPostStack]: NestedNavigatorParams<PropertyPostStackParamList>;
  [ScreensKeys.PropertyDetailsNotifications]: undefined;
};

export type FinancialsNavigatorParamList = {
  [ScreensKeys.FinancialsLandingScreen]: undefined;
  [ScreensKeys.AddRecordScreen]: undefined;
};

const BottomTabNavigator = createBottomTabNavigator<BottomTabNavigatorParamList>();
const DashboardNavigator = createStackNavigator<DashboardNavigatorParamList>();
const PortfolioNavigator = createStackNavigator<PortfolioNavigatorParamList>();
const FinancialsNavigator = createStackNavigator<FinancialsNavigatorParamList>();

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

export const BottomTabs = (): React.ReactElement => {
  const [isMoreToggled, setMoreToggled] = useState(false);
  const routeName = getFocusedRouteNameFromRoute(useRoute()) ?? ScreensKeys.Dashboard;
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);
  // Initial Route for guest and logged in user gets decided here
  if (isLoggedIn && routeName !== ScreensKeys.Search) {
    StatusBar.setBackgroundColor(theme.colors.primaryColor);
  } else {
    StatusBar.setBackgroundColor(theme.colors.white);
  }

  // TODO: Need to add type
  const getTabBarVisibility = (route: any): boolean => {
    const currentRouteName = getFocusedRouteNameFromRoute(route) ?? '';
    const notAllowedRoutes = [ScreensKeys.PropertyAssetDescription, ScreensKeys.ContactForm, ScreensKeys.AuthStack];
    return !notAllowedRoutes.includes(currentRouteName as ScreensKeys);
  };

  const renderKeyExtractor = (item: { id: number; title: string; icon: string }, index: number): string =>
    index.toString();

  const renderMoreStackItem = ({
    item,
    index,
  }: {
    item: { id: number; title: string; icon: string };
    index: number;
  }): React.ReactElement => {
    const onPress = (): void => {};
    return (
      <TouchableOpacity onPress={onPress}>
        <View key={`item-${index}`} style={styles.moreItem}>
          <Icon name={item.icon} size={20} color={theme.colors.shadow} />
          <Text
            type="small"
            textType="regular"
            style={styles.itemText}
            minimumFontScale={0.1}
            numberOfLines={2}
            allowFontScaling
          >
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSeparator = (): React.ReactElement => {
    return <Divider />;
  };

  const renderMoreStack = (): React.ReactNode => {
    if (!isMoreToggled) {
      return null;
    }
    return (
      <View style={styles.moreStack}>
        <FlatList
          data={MORE_STACK}
          numColumns={2}
          renderItem={(item: any): React.ReactElement => renderMoreStackItem(item)}
          keyExtractor={renderKeyExtractor}
          ItemSeparatorComponent={renderSeparator}
        />
      </View>
    );
  };

  return (
    <>
      <BottomTabNavigator.Navigator
        initialRouteName={isLoggedIn ? ScreensKeys.Dashboard : ScreensKeys.Search}
        lazy
        tabBarOptions={{
          activeTintColor: theme.colors.primaryColor,
          keyboardHidesTabBar: true,
        }}
      >
        <BottomTabNavigator.Screen
          name={ScreensKeys.Portfolio}
          component={isLoggedIn ? PortfolioStack : DefaultLogin}
          options={{
            tabBarLabel: ScreensKeys.Portfolio,
            tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
              <Icon name={icons.portfolio} color={color} size={22} />
            ),
          }}
        />
        <BottomTabNavigator.Screen
          name={ScreensKeys.Financials}
          component={isLoggedIn ? FinancialsStack : DefaultLogin}
          options={{
            tabBarLabel: ScreensKeys.Financials,
            tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
              <Icon name={icons.barChartOutline} color={color} size={22} />
            ),
          }}
        />
        <BottomTabNavigator.Screen
          name={ScreensKeys.Dashboard}
          component={isLoggedIn ? DashboardStack : DefaultLogin}
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
          component={isLoggedIn ? More : DefaultLogin}
          options={{
            tabBarLabel: ScreensKeys.More,
            tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
              <Icon name={icons.threeDots} color={color} size={22} />
            ),
          }}
          listeners={{
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            tabPress: (e) => {
              setMoreToggled(!isMoreToggled);
            },
          }}
        />
      </BottomTabNavigator.Navigator>
      {renderMoreStack()}
    </>
  );
};

const styles = StyleSheet.create({
  dashboardBump: {
    flex: 0,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...(theme.circleCSS(60) as object),
  },
  moreStack: {
    height: theme.viewport.height / 2,
    backgroundColor: theme.colors.white,
  },
  moreItem: {
    width: theme.viewport.width / 2,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    flex: 1,
  },
  itemText: {
    marginStart: 10,
    color: theme.colors.darkTint2,
  },
});
