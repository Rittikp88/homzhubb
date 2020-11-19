import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { NestedNavigatorParams, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import OnBoardingScreen from '@homzhub/mobile/src/screens/OnBoardingScreen';
import { WrapperSearchStack } from '@homzhub/mobile/src/navigation/WrapperSearchStack';
import { AuthStack, AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';

export type GuestStackNavigatorParamList = {
  [ScreensKeys.OnBoarding]: undefined;
  [ScreensKeys.GettingStarted]: undefined;
  [ScreensKeys.AuthStack]: NestedNavigatorParams<AuthStackParamList>;
  [ScreensKeys.SearchStack]: undefined;
};

const GuestStackNavigator = createStackNavigator<GuestStackNavigatorParamList>();

export function GuestStack(): React.ReactElement {
  return (
    <GuestStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <GuestStackNavigator.Screen name={ScreensKeys.OnBoarding} component={OnBoardingScreen} />
      <GuestStackNavigator.Screen name={ScreensKeys.AuthStack} component={AuthStack} />
      <GuestStackNavigator.Screen name={ScreensKeys.SearchStack} component={WrapperSearchStack} />
    </GuestStackNavigator.Navigator>
  );
}
