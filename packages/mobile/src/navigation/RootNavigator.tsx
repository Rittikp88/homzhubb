import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Splash } from '@homzhub/mobile/src/screens/Splash';
import AuthStack from '@homzhub/mobile/src/navigation/AuthStack';
import { AppNavigator } from '@homzhub/mobile/src/navigation/AppNavigator';

export const RootNavigator = (): React.ReactElement => {
  const isLoading = true;
  const isLoggedIn = false;

  if (isLoading) {
    return <Splash />;
  }

  return <NavigationContainer>{isLoggedIn ? <AppNavigator /> : <AuthStack />}</NavigationContainer>;
};
