import React, { useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from '@homzhub/ffm/src/navigation/AuthStack';

interface IProps {
  booting: boolean;
}

export const RootNavigator = ({ booting }: IProps): React.ReactElement => {
  useEffect(() => {
    if (!booting) {
      RNBootSplash.hide();
    }
  }, [booting]);

  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
};
