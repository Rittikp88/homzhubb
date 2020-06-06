import 'react-native-gesture-handler';
import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { AuthStack } from '@homzhub/mobile/src/navigation/AuthStack';
import { AppNavigator } from '@homzhub/mobile/src/navigation/AppNavigator';
import { Splash } from '@homzhub/mobile/src/screens/Splash';

interface IProps {
  booting: boolean;
}

export const RootNavigator = (props: IProps): React.ReactElement => {
  const { booting } = props;
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);

  if (booting) {
    return <Splash />;
  }

  return <NavigationContainer>{isLoggedIn ? <AppNavigator /> : <AuthStack />}</NavigationContainer>;
};
