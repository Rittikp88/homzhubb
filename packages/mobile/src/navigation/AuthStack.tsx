import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { GettingStarted } from '@homzhub/mobile/src/screens/GettingStarted';
import Onboarding from '@homzhub/mobile/src/screens/OnBoarding';
import { Otp } from '@homzhub/mobile/src/screens/Otp';
import SignUpScreen from '@homzhub/mobile/src/screens/SignUpScreen';
import { IOtpNavProps, ScreensKeys, ScreensTitles } from '@homzhub/mobile/src/navigation/interfaces';

const AuthStackNavigator = createStackNavigator<AuthStackParamList>();
export type AuthStackParamList = {
  [ScreensKeys.OnBoarding]: undefined;
  [ScreensKeys.GettingStarted]: undefined;
  [ScreensKeys.OTP]: IOtpNavProps;
  [ScreensKeys.SignUp]: undefined;
};

const AuthStack = (): React.ReactElement => {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <AuthStackNavigator.Screen
        name={ScreensKeys.OnBoarding}
        options={{ headerShown: false }}
        component={Onboarding}
      />
      <AuthStackNavigator.Screen
        name={ScreensKeys.GettingStarted}
        options={{ headerShown: false }}
        component={GettingStarted}
      />
      <AuthStackNavigator.Screen name={ScreensKeys.SignUp} options={{ headerShown: false }} component={SignUpScreen} />
      <AuthStackNavigator.Screen name={ScreensKeys.OTP} options={{ headerShown: false }} component={Otp} />
    </AuthStackNavigator.Navigator>
  );
};

export default AuthStack;
