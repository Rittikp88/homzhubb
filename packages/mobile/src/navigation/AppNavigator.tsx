import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { images } from '@homzhub/common/src/assets/images';
import {
  ScreensKeys,
  IAddPropertyMapProps,
  IServiceStepProps,
  IServiceDataProps,
  IMarkdownProps,
  NestedNavigatorParams,
} from '@homzhub/mobile/src/navigation/interfaces';
import { Image } from '@homzhub/common/src/components';
import AssetLandingScreen from '@homzhub/mobile/src/screens/Asset/AssetLandingScreen';
import { MarkdownView } from '@homzhub/mobile/src/screens/Asset/MarkdownView';
import AssetLocationMap from '@homzhub/mobile/src/screens/Asset/Record/AssetLocationMap';
import { AssetLocationSearch } from '@homzhub/mobile/src/screens/Asset/Record/AssetLocationSearch';
import AssetPackageSteps from '@homzhub/mobile/src/screens/Asset/Record/AssetPackageSteps';
import AssetServiceCheckoutSteps from '@homzhub/mobile/src/screens/Asset/Record/AssetServiceCheckoutSteps';
import AssetServiceSelection from '@homzhub/mobile/src/screens/Asset/Record/AssetServiceSelection';
import PropertyDetails from '@homzhub/mobile/src/screens/Asset/Record/PropertyDetails';
import ServiceDetailScreen from '@homzhub/mobile/src/screens/Asset/Record/ServiceDetailScreen';
import ServiceListScreen from '@homzhub/mobile/src/screens/Asset/Record/ServiceListScreen';
import Dashboard from '@homzhub/mobile/src/screens/Asset/Dashboard';
import { Financials } from '@homzhub/mobile/src/screens/Asset/Financials';
import { More } from '@homzhub/mobile/src/screens/Asset/More';
import { Portfolio } from '@homzhub/mobile/src/screens/Asset/Portfolio';
import { RootSearchStackNavigator } from '@homzhub/mobile/src/navigation/SearchStackNavigator';

export type AppStackParamList = {
  [ScreensKeys.PropertyPostLandingScreen]: undefined;
  [ScreensKeys.LoggedInBottomTabs]: undefined;
  [ScreensKeys.PropertyPostStack]: NestedNavigatorParams<PropertyPostStackParamList>;
};

export type PropertyPostStackParamList = {
  [ScreensKeys.PostPropertySearch]: undefined;
  [ScreensKeys.PostPropertyMap]: IAddPropertyMapProps;
  [ScreensKeys.PropertyDetailsScreen]: undefined;
  [ScreensKeys.RentServicesScreen]: undefined;
  [ScreensKeys.ServiceListScreen]: IServiceDataProps;
  [ScreensKeys.ServiceDetailScreen]: IServiceDataProps;
  [ScreensKeys.ServiceListSteps]: IServiceStepProps;
  [ScreensKeys.ServiceCheckoutSteps]: undefined;
  [ScreensKeys.MarkdownScreen]: IMarkdownProps;
};

export type LoggedInBottomTabNavigatorParamList = {
  [ScreensKeys.Portfolio]: undefined;
  [ScreensKeys.Financials]: undefined;
  [ScreensKeys.Dashboard]: undefined;
  [ScreensKeys.Search]: undefined;
  [ScreensKeys.More]: undefined;
};

const AppStackNavigator = createStackNavigator<AppStackParamList>();
const PropertyPostStackNavigator = createStackNavigator<PropertyPostStackParamList>();
const LoggedInBottomTabNavigator = createBottomTabNavigator<LoggedInBottomTabNavigatorParamList>();

export const PropertyPostStack = (): React.ReactElement => {
  return (
    <PropertyPostStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <PropertyPostStackNavigator.Screen name={ScreensKeys.PostPropertySearch} component={AssetLocationSearch} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.PostPropertyMap} component={AssetLocationMap} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.PropertyDetailsScreen} component={PropertyDetails} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.RentServicesScreen} component={AssetServiceSelection} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.ServiceListScreen} component={ServiceListScreen} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.ServiceDetailScreen} component={ServiceDetailScreen} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.ServiceListSteps} component={AssetPackageSteps} />
      <PropertyPostStackNavigator.Screen
        name={ScreensKeys.ServiceCheckoutSteps}
        component={AssetServiceCheckoutSteps}
      />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.MarkdownScreen} component={MarkdownView} />
    </PropertyPostStackNavigator.Navigator>
  );
};

// TODO: Icons needs to be replaced for bottom tabs
export const LoggedInBottomTabs = (): React.ReactElement => {
  return (
    <LoggedInBottomTabNavigator.Navigator
      initialRouteName={ScreensKeys.Dashboard}
      lazy
      tabBarOptions={{
        activeTintColor: theme.colors.primaryColor,
      }}
    >
      <LoggedInBottomTabNavigator.Screen
        name={ScreensKeys.Portfolio}
        component={Portfolio}
        options={{
          tabBarLabel: 'Portfolio',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.portfolio} color={color} size={22} />
          ),
        }}
      />
      <LoggedInBottomTabNavigator.Screen
        name={ScreensKeys.Financials}
        component={Financials}
        options={{
          tabBarLabel: 'Financials',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.barChartOutline} color={color} size={22} />
          ),
        }}
      />
      <LoggedInBottomTabNavigator.Screen
        name={ScreensKeys.Dashboard}
        component={Dashboard}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ focused }: { focused: boolean }): React.ReactElement => {
            return (
              <View style={styles.dashboardBump}>
                <Image source={focused ? images.dashboardFocused : images.dashboardUnfocused} />
              </View>
            );
          },
        }}
      />
      <LoggedInBottomTabNavigator.Screen
        name={ScreensKeys.Search}
        component={RootSearchStackNavigator}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => {
            return <Icon name={icons.search} color={color} size={22} />;
          },
          tabBarVisible: false,
        }}
      />
      <LoggedInBottomTabNavigator.Screen
        name={ScreensKeys.More}
        component={More}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.threeDots} color={color} size={22} />
          ),
        }}
      />
    </LoggedInBottomTabNavigator.Navigator>
  );
};

export function AppNavigator(): React.ReactElement {
  return (
    <AppStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <AppStackNavigator.Screen name={ScreensKeys.PropertyPostLandingScreen} component={AssetLandingScreen} />
      <AppStackNavigator.Screen name={ScreensKeys.LoggedInBottomTabs} component={LoggedInBottomTabs} />
      <AppStackNavigator.Screen name={ScreensKeys.PropertyPostStack} component={PropertyPostStack} />
    </AppStackNavigator.Navigator>
  );
}

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
