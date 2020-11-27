import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { GeolocationService } from '@homzhub/common/src/services/Geolocation/GeolocationService';
import { NavigationService } from '@homzhub/mobile/src/services/NavigationService';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { Splash } from '@homzhub/mobile/src/screens/Splash';
import { GuestStack } from '@homzhub/mobile/src/navigation/GuestStack';
import { AppNavigator } from '@homzhub/mobile/src/navigation/AppNavigator';

interface IProps {
  booting: boolean;
}

export const RootNavigator = (props: IProps): React.ReactElement => {
  const { booting } = props;
  const redirectionDetails = useSelector(CommonSelectors.getRedirectionDetails);
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);
  const isChangeStack = useSelector(UserSelector.getIsChangeStack);
  const searchAddress = useSelector(SearchSelector.getSearchAddress);
  const dispatch = useDispatch();

  // Fetch all user data as soon as user logs in
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(UserActions.getUserPreferences());
      dispatch(UserActions.getUserProfile());
      dispatch(UserActions.getUserProfile());
      dispatch(AssetActions.getAssetCount());
      dispatch(UserActions.getFavouriteProperties());
    }

    GeolocationService.setLocationDetails(isLoggedIn, searchAddress).then();
  }, [isLoggedIn, dispatch]);

  if (booting) {
    return <Splash />;
  }

  return (
    <NavigationContainer
      ref={NavigationService.setTopLevelNavigator}
      onReady={(): void => {
        NavigationService.handleDynamicLinkNavigation(redirectionDetails).then();
      }}
    >
      {isLoggedIn && isChangeStack ? <AppNavigator /> : <GuestStack />}
    </NavigationContainer>
  );
};
