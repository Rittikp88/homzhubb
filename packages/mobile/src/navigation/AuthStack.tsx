import React from 'react';
import { useSelector } from 'react-redux';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import EmailLoginScreen from '@homzhub/mobile/src/screens/Auth/EmailLoginScreen';
import ForgotPassword from '@homzhub/mobile/src/screens/Auth/ForgotPassword';
import GettingStarted from '@homzhub/mobile/src/screens/GettingStarted';
import LoginScreen from '@homzhub/mobile/src/screens/Auth/LoginScreen';
import MobileVerificationScreen from '@homzhub/mobile/src/screens/Auth/MobileVerificationScreen';
import OnBoarding from '@homzhub/mobile/src/screens/OnBoarding';
import Otp from '@homzhub/mobile/src/screens/Auth/Otp';
import SignUpScreen from '@homzhub/mobile/src/screens/Auth/SignUpScreen';
import SuccessResetPassword from '@homzhub/mobile/src/screens/Auth/SuccessResetPassword';
import ResetPassword from '@homzhub/mobile/src/screens/Auth/ResetPassword';
import PropertySearchLanding from '@homzhub/mobile/src/screens/PropertySearch/PropertySearchLanding';
import PropertyTabsScreen from '@homzhub/mobile/src/screens/PropertySearch/PropertyTabsScreen';
import {
  IOtpNavProps,
  ScreensKeys,
  IVerificationProps,
  IResetPasswordProps,
} from '@homzhub/mobile/src/navigation/interfaces';

const AuthStackNavigator = createStackNavigator<AuthStackParamList>();
export type AuthStackParamList = {
  [ScreensKeys.OnBoarding]: undefined;
  [ScreensKeys.GettingStarted]: undefined;
  [ScreensKeys.SignUp]: undefined;
  [ScreensKeys.MobileVerification]: IVerificationProps;
  [ScreensKeys.Login]: undefined;
  [ScreensKeys.EmailLogin]: undefined;
  [ScreensKeys.OTP]: IOtpNavProps;
  [ScreensKeys.ForgotPassword]: undefined;
  [ScreensKeys.ResetPassword]: IResetPasswordProps;
  [ScreensKeys.SuccessResetPassword]: undefined;
  [ScreensKeys.PropertySearchLanding]: undefined;
  [ScreensKeys.PropertyTabsScreen]: undefined;
};

export function AuthStack(): React.ReactElement {
  const hasOnBoardingCompleted = useSelector(UserSelector.hasOnBoardingCompleted);

  const showOnBoardingScreen = (): React.ReactNode => {
    if (!hasOnBoardingCompleted) {
      return <AuthStackNavigator.Screen name={ScreensKeys.OnBoarding} component={OnBoarding} />;
    }
    return null;
  };

  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {showOnBoardingScreen()}
      <AuthStackNavigator.Screen name={ScreensKeys.GettingStarted} component={GettingStarted} />
      <AuthStackNavigator.Screen name={ScreensKeys.SignUp} component={SignUpScreen} />
      <AuthStackNavigator.Screen name={ScreensKeys.Login} component={LoginScreen} />
      <AuthStackNavigator.Screen name={ScreensKeys.EmailLogin} component={EmailLoginScreen} />
      <AuthStackNavigator.Screen name={ScreensKeys.MobileVerification} component={MobileVerificationScreen} />
      <AuthStackNavigator.Screen name={ScreensKeys.OTP} component={Otp} />
      <AuthStackNavigator.Screen name={ScreensKeys.ForgotPassword} component={ForgotPassword} />
      <AuthStackNavigator.Screen name={ScreensKeys.ResetPassword} component={ResetPassword} />
      <AuthStackNavigator.Screen name={ScreensKeys.SuccessResetPassword} component={SuccessResetPassword} />
      <AuthStackNavigator.Screen name={ScreensKeys.PropertySearchLanding} component={PropertySearchLanding} />
      <AuthStackNavigator.Screen name={ScreensKeys.PropertyTabsScreen} component={PropertyTabsScreen} />
    </AuthStackNavigator.Navigator>
  );
}
