import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Splash } from '@homzhub/mobile/src/screens/Splash';
import AuthStack from '@homzhub/mobile/src/navigation/AuthStack';
import { AppNavigator } from '@homzhub/mobile/src/navigation/AppNavigator';

interface IProps {
  isLocalizationLoading: boolean;
}

export const RootNavigator = (props: IProps): React.ReactElement => {
  const { isLocalizationLoading } = props;
  const isLoggedIn = false;

  if (!isLocalizationLoading) {
    return <Splash />;
  }

  return <NavigationContainer>{isLoggedIn ? <AppNavigator /> : <AuthStack />}</NavigationContainer>;
};
