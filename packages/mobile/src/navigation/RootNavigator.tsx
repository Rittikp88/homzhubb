import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { LinkingService } from '@homzhub/mobile/src/services/LinkingService';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
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
  const dispatch = useDispatch();

  // Fetch all user data as soon as user logs in
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(UserActions.getUserPreferences());
      dispatch(UserActions.getUserProfile());
      dispatch(UserActions.getUserProfile());
      dispatch(AssetActions.getAssetCount());
    }
  }, [isLoggedIn]);

  if (booting) {
    return <Splash />;
  }

  return (
    <NavigationContainer linking={LinkingService.getLinkingOptions(isLoggedIn)}>
      {isLoggedIn && isChangeStack ? <AppNavigator /> : <GuestStack />}
    </NavigationContainer>
  );
};
