import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import {
  ScreensKeys,
  IAddPropertyMapProps,
  IPropertyDetailScreenProps,
} from '@homzhub/mobile/src/navigation/interfaces';
import { AddPropertyMap } from '@homzhub/mobile/src/screens/PropertyPost/AddPropertyMap';
import LandingScreen from '@homzhub/mobile/src/screens/PropertyPost/LandingScreen';
import PropertyDetails from '@homzhub/mobile/src/screens/PropertyPost/PropertyDetails';
import { SearchProperty } from '@homzhub/mobile/src/screens/PropertyPost/SearchProperty';
import RentServices from '@homzhub/mobile/src/screens/PropertyPost/RentServices';

export type AppStackParamList = {
  [ScreensKeys.PropertyPostLandingScreen]: undefined;
  [ScreensKeys.SearchPropertyOwner]: undefined;
  [ScreensKeys.AddProperty]: IAddPropertyMapProps;
  [ScreensKeys.PropertyDetailsScreen]: IPropertyDetailScreenProps;
  [ScreensKeys.RentServicesScreen]: undefined;
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
      <AppStackNavigator.Screen name={ScreensKeys.SearchPropertyOwner} component={SearchProperty} />
      <AppStackNavigator.Screen name={ScreensKeys.AddProperty} component={AddPropertyMap} />
      <AppStackNavigator.Screen name={ScreensKeys.PropertyDetailsScreen} component={PropertyDetails} />
      <AppStackNavigator.Screen name={ScreensKeys.RentServicesScreen} component={RentServices} />
    </AppStackNavigator.Navigator>
  );
}
