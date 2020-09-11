import 'react-native-gesture-handler';
import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { Splash } from '@homzhub/mobile/src/screens/Splash';
import { GuestStack } from '@homzhub/mobile/src/navigation/GuestStack';
import { AppNavigator } from '@homzhub/mobile/src/navigation/AppNavigator';

interface IProps {
  booting: boolean;
}

export const RootNavigator = (props: IProps): React.ReactElement => {
  const { booting } = props;
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);
  const isChangeStack = useSelector(UserSelector.getIsChangeStack);

  if (booting) {
    return <Splash />;
  }

  return (
    <NavigationContainer linking={LinkingService.getLinkingOptions(isLoggedIn)}>
      {isLoggedIn && isChangeStack ? <AppNavigator /> : <GuestStack />}
    </NavigationContainer>
  );
};
