import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { ScreensKeys, NestedNavigatorParams } from '@homzhub/mobile/src/navigation/interfaces';
import AssetLandingScreen from '@homzhub/mobile/src/screens/Asset/AssetLandingScreen';
import { BottomTabNavigatorParamList, BottomTabs } from '@homzhub/mobile/src/navigation/BottomTabs';
import { PropertyPostStack, PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';

export type AppStackParamList = {
  [ScreensKeys.PropertyPostLandingScreen]: undefined;
  [ScreensKeys.BottomTabs]: NestedNavigatorParams<BottomTabNavigatorParamList>;
  [ScreensKeys.PropertyPostStack]: NestedNavigatorParams<PropertyPostStackParamList>;
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
      <AppStackNavigator.Screen name={ScreensKeys.PropertyPostLandingScreen} component={AssetLandingScreen} />
      <AppStackNavigator.Screen name={ScreensKeys.BottomTabs} component={BottomTabs} />
      <AppStackNavigator.Screen name={ScreensKeys.PropertyPostStack} component={PropertyPostStack} />
    </AppStackNavigator.Navigator>
  );
}
