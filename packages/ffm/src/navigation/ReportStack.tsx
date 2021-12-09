import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReportDashboard from '@homzhub/ffm/src/screens/Reports';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type ReportStackParamList = {
  [ScreenKeys.ReportDashboard]: undefined;
};

const ReportStackNavigator = createStackNavigator<ReportStackParamList>();

const ReportStack = (): React.ReactElement => {
  return (
    <ReportStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <ReportStackNavigator.Screen name={ScreenKeys.ReportDashboard} component={ReportDashboard} />
    </ReportStackNavigator.Navigator>
  );
};

export default ReportStack;
