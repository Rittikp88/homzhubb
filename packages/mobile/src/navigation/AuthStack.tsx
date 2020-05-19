import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import Onboarding from '@homzhub/mobile/src/screens/OnBoarding';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { GettingStarted } from '@homzhub/mobile/src/screens/GettingStarted';
import SignUpScreen from '@homzhub/mobile/src/screens/SignUpScreen';

const AuthStackNavigator = createStackNavigator<AuthStackParamList>();
export type AuthStackParamList = {
  [ScreensKeys.OnBoarding]: undefined;
  [ScreensKeys.GettingStarted]: undefined;
  [ScreensKeys.SignUp]: undefined;
};

const AuthStack = (): React.ReactElement => {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <AuthStackNavigator.Screen name={ScreensKeys.OnBoarding} component={Onboarding} />
      <AuthStackNavigator.Screen name={ScreensKeys.GettingStarted} component={GettingStarted} />
      <AuthStackNavigator.Screen name={ScreensKeys.SignUp} component={SignUpScreen} />
    </AuthStackNavigator.Navigator>
  );
};

export default AuthStack;
