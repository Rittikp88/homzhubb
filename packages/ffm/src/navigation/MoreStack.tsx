import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MoreScreen from '@homzhub/ffm/src/screens/More';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type MoreStackParamList = {
  [ScreenKeys.MoreScreen]: undefined;
};

const MoreStackNavigator = createStackNavigator<MoreStackParamList>();

const MoreStack = (): React.ReactElement => {
  return (
    <MoreStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <MoreStackNavigator.Screen name={ScreenKeys.MoreScreen} component={MoreScreen} />
    </MoreStackNavigator.Navigator>
  );
};

export default MoreStack;
