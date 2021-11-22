import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import ComingSoon from '@homzhub/ffm/src/screens/Common/ComingSoon';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type AuthStackParamList = {
  [ScreenKeys.OnBoarding]: undefined;
  [ScreenKeys.Login]: undefined;
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
      <AuthStackNavigator.Screen name={ScreenKeys.OnBoarding} component={ComingSoon} />
      <AuthStackNavigator.Screen name={ScreenKeys.Login} component={ComingSoon} />
    </AuthStackNavigator.Navigator>
  );
};

export default AuthStack;
