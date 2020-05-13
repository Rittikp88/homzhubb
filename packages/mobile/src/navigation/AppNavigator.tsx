import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { TabKeys } from './interfaces';

const TabNavigator = createBottomTabNavigator<AppTabParamList>();
export type AppTabParamList = {
  [TabKeys.Home]: undefined;
  [TabKeys.Profile]: undefined;
};

const dummy = (): React.ReactElement => <Text>Dummy</Text>;

export const AppNavigator = (): React.ReactElement => {
  return (
    <TabNavigator.Navigator>
      <TabNavigator.Screen name={TabKeys.Home} component={dummy} />
      <TabNavigator.Screen name={TabKeys.Profile} component={dummy} />
    </TabNavigator.Navigator>
  );
};
