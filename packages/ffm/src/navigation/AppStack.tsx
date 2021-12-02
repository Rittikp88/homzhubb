import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from '@homzhub/ffm/src/navigation/BottomTabs';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type AppStackParamList = {
  [ScreenKeys.BottomTab]: undefined;
};

const AppStackNavigator = createStackNavigator<AppStackParamList>();

const AppStack = (): React.ReactElement => {
  return (
    <AppStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <AppStackNavigator.Screen name={ScreenKeys.BottomTab} component={BottomTabs} />
    </AppStackNavigator.Navigator>
  );
};

export default AppStack;
