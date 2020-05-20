import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { GettingStarted } from '@homzhub/mobile/src/screens/GettingStarted';
import OnBoarding from '@homzhub/mobile/src/screens/OnBoarding';
import { Otp } from '@homzhub/mobile/src/screens/Otp';
import SignUpScreen from '@homzhub/mobile/src/screens/SignUpScreen';
import { IOtpNavProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const AuthStackNavigator = createStackNavigator<AuthStackParamList>();
export type AuthStackParamList = {
  [ScreensKeys.OnBoarding]: undefined;
  [ScreensKeys.GettingStarted]: undefined;
  [ScreensKeys.OTP]: IOtpNavProps;
  [ScreensKeys.SignUp]: undefined;
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
      <AuthStackNavigator.Screen name={ScreensKeys.OTP} component={Otp} />
    </AuthStackNavigator.Navigator>
  );
}
