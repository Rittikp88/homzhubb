import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import {
  ScreensKeys,
  IAddPropertyMapProps,
  IServiceStepProps,
  IServiceDataProps,
  IMarkdownProps,
  IContactProps,
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

export type AppStackParamList = {
  [ScreensKeys.PropertyPostLandingScreen]: undefined;
  [ScreensKeys.PostPropertySearch]: undefined;
  [ScreensKeys.PostPropertyMap]: IAddPropertyMapProps;
  [ScreensKeys.PropertyDetailsScreen]: undefined;
  [ScreensKeys.RentServicesScreen]: undefined;
  [ScreensKeys.ServiceListScreen]: IServiceDataProps;
  [ScreensKeys.ServiceDetailScreen]: IServiceDataProps;
  [ScreensKeys.ServiceListSteps]: IServiceStepProps;
  [ScreensKeys.ServiceCheckoutSteps]: undefined;
  [ScreensKeys.MarkdownScreen]: IMarkdownProps;
  [ScreensKeys.SearchStack]: undefined;
  [ScreensKeys.ContactForm]: IContactProps;
};

const AppStackNavigator = createStackNavigator<AppStackParamList>();

export function AppNavigator(): React.ReactElement {
  return (
    <AppStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <AppStackNavigator.Screen name={ScreensKeys.PropertyPostLandingScreen} component={LandingScreen} />
      <AppStackNavigator.Screen name={ScreensKeys.PostPropertySearch} component={PostPropertySearch} />
      <AppStackNavigator.Screen name={ScreensKeys.PostPropertyMap} component={PostPropertyMap} />
      <AppStackNavigator.Screen name={ScreensKeys.PropertyDetailsScreen} component={PropertyDetails} />
      <AppStackNavigator.Screen name={ScreensKeys.RentServicesScreen} component={RentServices} />
      <AppStackNavigator.Screen name={ScreensKeys.ServiceListScreen} component={ServiceListScreen} />
      <AppStackNavigator.Screen name={ScreensKeys.ServiceDetailScreen} component={ServiceDetailScreen} />
      <AppStackNavigator.Screen name={ScreensKeys.ServiceListSteps} component={ServiceListSteps} />
      <AppStackNavigator.Screen name={ScreensKeys.ServiceCheckoutSteps} component={ServiceCheckoutSteps} />
      <AppStackNavigator.Screen name={ScreensKeys.MarkdownScreen} component={MarkdownView} />
    </AppStackNavigator.Navigator>
  );
}
