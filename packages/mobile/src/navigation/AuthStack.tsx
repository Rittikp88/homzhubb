import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import {
  IOtpNavProps,
  ScreensKeys,
  IVerificationProps,
  IResetPasswordProps,
  IScreenCallback,
  IWebviewProps,
  IForgotPasswordProps,
} from '@homzhub/mobile/src/navigation/interfaces';
import EmailLoginScreen from '@homzhub/mobile/src/screens/Auth/EmailLoginScreen';
import ForgotPassword from '@homzhub/mobile/src/screens/Auth/ForgotPassword';
import LoginScreen from '@homzhub/mobile/src/screens/Auth/LoginScreen';
import MobileVerificationScreen from '@homzhub/mobile/src/screens/Auth/MobileVerificationScreen';
import Otp from '@homzhub/mobile/src/screens/Auth/Otp';
import SignUpScreen from '@homzhub/mobile/src/screens/Auth/SignUpScreen';
import SuccessResetPassword from '@homzhub/mobile/src/screens/Auth/SuccessResetPassword';
import ResetPassword from '@homzhub/mobile/src/screens/Auth/ResetPassword';
import { WebViewScreen } from '@homzhub/mobile/src/screens/common/WebViewScreen';

export type AuthStackParamList = {
  [ScreensKeys.SignUp]: IScreenCallback;
  [ScreensKeys.MobileVerification]: IVerificationProps;
  [ScreensKeys.Login]: IScreenCallback;
  [ScreensKeys.EmailLogin]: IScreenCallback | undefined;
  [ScreensKeys.OTP]: IOtpNavProps;
  [ScreensKeys.ForgotPassword]: IForgotPasswordProps;
  [ScreensKeys.ResetPassword]: IResetPasswordProps;
  [ScreensKeys.SuccessResetPassword]: IScreenCallback;
  [ScreensKeys.WebViewScreen]: IWebviewProps;
};

export const AuthStackNavigator = createStackNavigator<AuthStackParamList>();

export function AuthStack(): React.ReactElement {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <AuthStackNavigator.Screen name={ScreensKeys.SignUp} component={SignUpScreen} />
      <AuthStackNavigator.Screen name={ScreensKeys.Login} component={LoginScreen} />
      <AuthStackNavigator.Screen name={ScreensKeys.EmailLogin} component={EmailLoginScreen} />
      <AuthStackNavigator.Screen name={ScreensKeys.MobileVerification} component={MobileVerificationScreen} />
      <AuthStackNavigator.Screen name={ScreensKeys.OTP} component={Otp} />
      <AuthStackNavigator.Screen name={ScreensKeys.ForgotPassword} component={ForgotPassword} />
      <AuthStackNavigator.Screen name={ScreensKeys.ResetPassword} component={ResetPassword} />
      <AuthStackNavigator.Screen name={ScreensKeys.SuccessResetPassword} component={SuccessResetPassword} />
      <AuthStackNavigator.Screen name={ScreensKeys.WebViewScreen} component={WebViewScreen} />
    </AuthStackNavigator.Navigator>
  );
}
