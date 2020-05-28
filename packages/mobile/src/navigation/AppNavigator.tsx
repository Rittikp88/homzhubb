import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import LandingScreen from '@homzhub/mobile/src/screens/PropertyPost/LandingScreen';

export type AppStackParamList = {
  [ScreensKeys.PropertyPostLandingScreen]: undefined;
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
    </AppStackNavigator.Navigator>
  );
}