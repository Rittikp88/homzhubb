import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import EmailLoginScreen from '@homzhub/ffm/src/screens/Auth/EmailLoginScreen';
import LoginScreen from '@homzhub/ffm/src/screens/Auth/LoginScreen';
import MobileVerification from '@homzhub/ffm/src/screens/Auth/MobileVerification';
import Signup from '@homzhub/ffm/src/screens/Auth/Signup';
import WorkLocations from '@homzhub/ffm/src/screens/Auth/WorkLocations';
import OnBoarding from '@homzhub/ffm/src/screens/Common/OnBoarding';
import { IVerification, ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type AuthStackParamList = {
  [ScreenKeys.OnBoarding]: undefined;
  [ScreenKeys.Login]: undefined;
  [ScreenKeys.EmailLogin]: undefined;
  [ScreenKeys.Signup]: undefined;
  [ScreenKeys.WorkLocations]: IVerification;
  [ScreenKeys.MobileVerification]: IVerification;
};

export const AuthStackNavigator = createStackNavigator<AuthStackParamList>();

const AuthStack = (): React.ReactElement => {
  return (
    <AuthStackNavigator.Navigator
      initialRouteName={ScreenKeys.OnBoarding}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <AuthStackNavigator.Screen name={ScreenKeys.OnBoarding} component={OnBoarding} />
      <AuthStackNavigator.Screen name={ScreenKeys.Login} component={LoginScreen} />
      <AuthStackNavigator.Screen name={ScreenKeys.EmailLogin} component={EmailLoginScreen} />
      <AuthStackNavigator.Screen name={ScreenKeys.Signup} component={Signup} />
      <AuthStackNavigator.Screen name={ScreenKeys.WorkLocations} component={WorkLocations} />
      <AuthStackNavigator.Screen name={ScreenKeys.MobileVerification} component={MobileVerification} />
    </AuthStackNavigator.Navigator>
  );
};

export default AuthStack;
