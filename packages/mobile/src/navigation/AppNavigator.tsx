import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { ScreensKeys, NestedNavigatorParams } from '@homzhub/mobile/src/navigation/interfaces';
import AssetLandingScreen from '@homzhub/mobile/src/screens/Asset/AssetLandingScreen';
import { BlankScreen } from '@homzhub/mobile/src/screens/BlankScreen';
import { BottomTabNavigatorParamList, BottomTabs } from '@homzhub/mobile/src/navigation/BottomTabs';
import { PropertyPostStack, PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';

export type AppStackParamList = {
  [ScreensKeys.PropertyPostLandingScreen]: undefined;
  [ScreensKeys.BottomTabs]: NestedNavigatorParams<BottomTabNavigatorParamList>;
  // Todo (Sriram: 2020.09.11) Replace this with not found screen
  [ScreensKeys.BlankScreen]: undefined;
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
      <AppStackNavigator.Screen name={ScreensKeys.BlankScreen} component={BlankScreen} />
      <AppStackNavigator.Screen name={ScreensKeys.PropertyPostStack} component={PropertyPostStack} />
    </AppStackNavigator.Navigator>
  );
}
