import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ReportDashboard from '@homzhub/ffm/src/screens/Reports';
import InspectionSelection from '@homzhub/ffm/src/screens/Reports/InspectionSelection';
import ReportLocationMap from '@homzhub/ffm/src/screens/Reports/ReportLocationMap';
import { ILocationParam, ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type ReportStackParamList = {
  [ScreenKeys.ReportDashboard]: undefined;
  [ScreenKeys.InspectionSelection]: undefined;
  [ScreenKeys.ReportLocationMap]: ILocationParam;
};

const ReportStackNavigator = createStackNavigator<ReportStackParamList>();

const ReportStack = (): React.ReactElement => {
  return (
    <ReportStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <ReportStackNavigator.Screen name={ScreenKeys.ReportDashboard} component={ReportDashboard} />
      <ReportStackNavigator.Screen name={ScreenKeys.InspectionSelection} component={InspectionSelection} />
      <ReportStackNavigator.Screen name={ScreenKeys.ReportLocationMap} component={ReportLocationMap} />
    </ReportStackNavigator.Navigator>
  );
};

export default ReportStack;
