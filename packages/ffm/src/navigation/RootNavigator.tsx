import React, { useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { GeolocationService } from '@homzhub/common/src/services/Geolocation/GeolocationService';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import AppStack from '@homzhub/ffm/src/navigation/AppStack';
import AuthStack from '@homzhub/ffm/src/navigation/AuthStack';

interface IProps {
  booting: boolean;
}

export const RootNavigator = ({ booting }: IProps): React.ReactElement => {
  const isLoggedIn = useSelector(UserSelector.isLoggedIn);

  useEffect(() => {
    GeolocationService.setLocationDetails(false, '').then();
  }, []);

  useEffect(() => {
    if (!booting) {
      RNBootSplash.hide();
    }
  }, [booting]);

  return <NavigationContainer>{isLoggedIn ? <AppStack /> : <AuthStack />}</NavigationContainer>;
};
