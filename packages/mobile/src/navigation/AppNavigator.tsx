import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import LandingScreen from '@homzhub/mobile/src/screens/PropertyPost/LandingScreen';
import PropertyDetails from '@homzhub/mobile/src/screens/PropertyPost/PropertyDetails';
import RentServices from '@homzhub/mobile/src/screens/PropertyPost/RentServices';

export type AppStackParamList = {
  [ScreensKeys.PropertyPostLandingScreen]: undefined;
  [ScreensKeys.PropertyDetailsScreen]: undefined;
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
      <AppStackNavigator.Screen name={ScreensKeys.PropertyDetailsScreen} component={PropertyDetails} />
      <AppStackNavigator.Screen name={ScreensKeys.RentServicesScreen} component={RentServices} />
    </AppStackNavigator.Navigator>
  );
}
