import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SiteVisitDashboard from '@homzhub/ffm/src/screens/SiteVisits';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type VisitStackParamList = {
  [ScreenKeys.SiteVisitDashboard]: undefined;
};

const VisitStackNavigator = createStackNavigator<VisitStackParamList>();

const VisitStack = (): React.ReactElement => {
  return (
    <VisitStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <VisitStackNavigator.Screen name={ScreenKeys.SiteVisitDashboard} component={SiteVisitDashboard} />
    </VisitStackNavigator.Navigator>
  );
};

export default VisitStack;
