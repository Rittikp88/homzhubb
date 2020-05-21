import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { GettingStarted } from '@homzhub/mobile/src/screens/GettingStarted';
import OnBoarding from '@homzhub/mobile/src/screens/OnBoarding';
import SignUpScreen from '@homzhub/mobile/src/screens/SignUpScreen';
import MobileVerificationScreen from '@homzhub/mobile/src/screens/MobileVerifactionScreen';
import { Otp } from '@homzhub/mobile/src/screens/Otp';
import ForgotPassword from '@homzhub/mobile/src/screens/ForgotPassword';
import ResetPassword from '@homzhub/mobile/src/screens/ResetPassword';
import SuccessResetPassword from '@homzhub/mobile/src/screens/SuccessResetPassword';
import { IOtpNavProps, ScreensKeys, IVerificationProps } from '@homzhub/mobile/src/navigation/interfaces';

const AuthStackNavigator = createStackNavigator<AuthStackParamList>();
export type AuthStackParamList = {
  [ScreensKeys.OnBoarding]: undefined;
  [ScreensKeys.GettingStarted]: undefined;
  [ScreensKeys.SignUp]: undefined;
  [ScreensKeys.MobileVerification]: IVerificationProps;
  [ScreensKeys.OTP]: IOtpNavProps;
  [ScreensKeys.ForgotPassword]: undefined;
  [ScreensKeys.ResetPassword]: undefined;
  [ScreensKeys.SuccessResetPassword]: undefined;
};

interface IProps {
  showOnBoarding: boolean;
}

export function AuthStack(props: IProps): React.ReactElement {
  const { showOnBoarding } = props;
  const showOnBoardingScreen = (): React.ReactNode => {
    if (showOnBoarding) {
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
      <AuthStackNavigator.Screen name={ScreensKeys.MobileVerification} component={MobileVerificationScreen} />
      <AuthStackNavigator.Screen name={ScreensKeys.OTP} component={Otp} />
      <AuthStackNavigator.Screen name={ScreensKeys.ForgotPassword} component={ForgotPassword} />
      <AuthStackNavigator.Screen name={ScreensKeys.ResetPassword} component={ResetPassword} />
      <AuthStackNavigator.Screen name={ScreensKeys.SuccessResetPassword} component={SuccessResetPassword} />
    </AuthStackNavigator.Navigator>
  );
}
