import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthStack } from '@homzhub/mobile/src/navigation/AuthStack';
import { AppNavigator } from '@homzhub/mobile/src/navigation/AppNavigator';
import { Splash } from '@homzhub/mobile/src/screens/Splash';

interface IProps {
  booting: boolean;
  isLoggedIn: boolean;
  showOnBoarding: boolean;
}

export const RootNavigator = (props: IProps): React.ReactElement => {
  const { booting, isLoggedIn, showOnBoarding } = props;

  if (booting) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppNavigator /> : <AuthStack showOnBoarding={showOnBoarding} />}
    </NavigationContainer>
  );
};
