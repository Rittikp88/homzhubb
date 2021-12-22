import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '@homzhub/ffm/src/screens/Dashboard';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type DashboardStackParamList = {
  [ScreenKeys.DashboardScreen]: undefined;
};

const DashboardStackNavigator = createStackNavigator<DashboardStackParamList>();

const DashboardStack = (): React.ReactElement => {
  return (
    <DashboardStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStackNavigator.Screen name={ScreenKeys.DashboardScreen} component={Dashboard} />
    </DashboardStackNavigator.Navigator>
  );
};

export default DashboardStack;
