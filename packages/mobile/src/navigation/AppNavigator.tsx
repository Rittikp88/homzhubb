import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import {
  ScreensKeys,
  IAddPropertyMapProps,
  IServiceStepProps,
  IServiceDataProps,
} from '@homzhub/mobile/src/navigation/interfaces';
import { AddPropertyMap } from '@homzhub/mobile/src/screens/PropertyPost/AddPropertyMap';
import LandingScreen from '@homzhub/mobile/src/screens/PropertyPost/LandingScreen';
import PropertyDetails from '@homzhub/mobile/src/screens/PropertyPost/PropertyDetails';
import RentServices from '@homzhub/mobile/src/screens/PropertyPost/RentServices';
import { SearchProperty } from '@homzhub/mobile/src/screens/PropertyPost/SearchProperty';
import { ServiceCheckoutSteps } from '@homzhub/mobile/src/screens/Service/ServiceCheckoutSteps';
import ServiceDetailScreen from '@homzhub/mobile/src/screens/Service/ServiceDetailScreen';
import ServiceListScreen from '@homzhub/mobile/src/screens/Service/ServiceListScreen';
import ServiceListSteps from '@homzhub/mobile/src/screens/Service/ServiceListSteps';

export type AppStackParamList = {
  [ScreensKeys.PropertyPostLandingScreen]: undefined;
  [ScreensKeys.SearchPropertyOwner]: undefined;
  [ScreensKeys.AddProperty]: IAddPropertyMapProps;
  [ScreensKeys.PropertyDetailsScreen]: undefined;
  [ScreensKeys.RentServicesScreen]: undefined;
  [ScreensKeys.ServiceListScreen]: IServiceDataProps;
  [ScreensKeys.ServiceDetailScreen]: IServiceDataProps;
  [ScreensKeys.ServiceListSteps]: IServiceStepProps;
  [ScreensKeys.ServiceCheckoutSteps]: undefined;
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
      <AppStackNavigator.Screen name={ScreensKeys.ServiceCheckoutSteps} component={ServiceCheckoutSteps} />
      <AppStackNavigator.Screen name={ScreensKeys.PropertyPostLandingScreen} component={LandingScreen} />
      <AppStackNavigator.Screen name={ScreensKeys.SearchPropertyOwner} component={SearchProperty} />
      <AppStackNavigator.Screen name={ScreensKeys.AddProperty} component={AddPropertyMap} />
      <AppStackNavigator.Screen name={ScreensKeys.PropertyDetailsScreen} component={PropertyDetails} />
      <AppStackNavigator.Screen name={ScreensKeys.RentServicesScreen} component={RentServices} />
      <AppStackNavigator.Screen name={ScreensKeys.ServiceListScreen} component={ServiceListScreen} />
      <AppStackNavigator.Screen name={ScreensKeys.ServiceDetailScreen} component={ServiceDetailScreen} />
      <AppStackNavigator.Screen name={ScreensKeys.ServiceListSteps} component={ServiceListSteps} />
    </AppStackNavigator.Navigator>
  );
}
