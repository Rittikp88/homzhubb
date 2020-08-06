import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import {
  ScreensKeys,
  IAddPropertyMapProps,
  IServiceStepProps,
  IServiceDataProps,
  IMarkdownProps,
  NestedNavigatorParams,
} from '@homzhub/mobile/src/navigation/interfaces';
import PostPropertyMap from '@homzhub/mobile/src/screens/PropertyPost/PostPropertyMap';
import LandingScreen from '@homzhub/mobile/src/screens/PropertyPost/LandingScreen';
import PropertyDetails from '@homzhub/mobile/src/screens/PropertyPost/PropertyDetails';
import RentServices from '@homzhub/mobile/src/screens/PropertyPost/RentServices';
import { PostPropertySearch } from '@homzhub/mobile/src/screens/PropertyPost/PostPropertySearch';
import ServiceCheckoutSteps from '@homzhub/mobile/src/screens/Service/ServiceCheckoutSteps';
import ServiceDetailScreen from '@homzhub/mobile/src/screens/Service/ServiceDetailScreen';
import ServiceListScreen from '@homzhub/mobile/src/screens/Service/ServiceListScreen';
import ServiceListSteps from '@homzhub/mobile/src/screens/Service/ServiceListSteps';
import { MarkdownView } from '@homzhub/mobile/src/screens/MarkdownView';
import { Portfolio } from '@homzhub/mobile/src/screens/LoggedInFlow/Portfolio';
import { Financials } from '@homzhub/mobile/src/screens/LoggedInFlow/Financials';
import Dashboard from '@homzhub/mobile/src/screens/LoggedInFlow/Dashboard';
import { More } from '@homzhub/mobile/src/screens/LoggedInFlow/More';
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
      <PropertyPostStackNavigator.Screen name={ScreensKeys.PostPropertySearch} component={PostPropertySearch} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.PostPropertyMap} component={PostPropertyMap} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.PropertyDetailsScreen} component={PropertyDetails} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.RentServicesScreen} component={RentServices} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.ServiceListScreen} component={ServiceListScreen} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.ServiceDetailScreen} component={ServiceDetailScreen} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.ServiceListSteps} component={ServiceListSteps} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.ServiceCheckoutSteps} component={ServiceCheckoutSteps} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.MarkdownScreen} component={MarkdownView} />
    </PropertyPostStackNavigator.Navigator>
  );
};

// TODO: Icons needs to be replaced for bottom tabs
export const LoggedInBottomTabs = (): React.ReactElement => {
  return (
    <LoggedInBottomTabNavigator.Navigator
      initialRouteName={ScreensKeys.Dashboard}
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
            <Icon name={icons.search} color={color} size={22} />
          ),
        }}
      />
      <LoggedInBottomTabNavigator.Screen
        name={ScreensKeys.Financials}
        component={Financials}
        options={{
          tabBarLabel: 'Financials',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.heartOutline} color={color} size={22} />
          ),
        }}
      />
      <LoggedInBottomTabNavigator.Screen
        name={ScreensKeys.Dashboard}
        component={Dashboard}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }: { color: string }): React.ReactElement => (
            <Icon name={icons.compare} color={color} size={30} />
          ),
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
      <AppStackNavigator.Screen name={ScreensKeys.PropertyPostLandingScreen} component={LandingScreen} />
      <AppStackNavigator.Screen name={ScreensKeys.LoggedInBottomTabs} component={LoggedInBottomTabs} />
      <AppStackNavigator.Screen name={ScreensKeys.PropertyPostStack} component={PropertyPostStack} />
    </AppStackNavigator.Navigator>
  );
}
