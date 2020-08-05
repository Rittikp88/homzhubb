import 'react-native-gesture-handler';
import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { Splash } from '@homzhub/mobile/src/screens/Splash';
import { MainStack } from '@homzhub/mobile/src/navigation/MainStackNavigator';
import { AppNavigator } from '@homzhub/mobile/src/navigation/AppNavigator';

interface IProps {
  booting: boolean;
}

export const RootNavigator = (props: IProps): React.ReactElement => {
  const { booting } = props;
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);

  if (booting) {
    return <Splash />;
  }

  return <NavigationContainer>{isLoggedIn ? <AppNavigator /> : <MainStack />}</NavigationContainer>;
};
