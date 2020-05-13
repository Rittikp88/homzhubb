import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { SearchOnBoarding } from '@homzhub/mobile/src/screens/SearchOnBorading';
import { PostOnBoarding } from '@homzhub/mobile/src/screens/PostOnBoarding';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const AuthStackNavigator = createStackNavigator<AuthStackParamList>();
export type AuthStackParamList = {
  [ScreensKeys.SearchOnBoarding]: undefined;
  [ScreensKeys.PostOnBoarding]: undefined;
};

const AuthStack = (): React.ReactElement => {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <AuthStackNavigator.Screen name={ScreensKeys.SearchOnBoarding} component={SearchOnBoarding} />
      <AuthStackNavigator.Screen name={ScreensKeys.PostOnBoarding} component={PostOnBoarding} />
    </AuthStackNavigator.Navigator>
  );
};

export default AuthStack;
