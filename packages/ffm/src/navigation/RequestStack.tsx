import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RequestDashboard from '@homzhub/ffm/src/screens/Requests';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type MoreStackParamList = {
  [ScreenKeys.RequestsDashboard]: undefined;
};

const RequestStackNavigator = createStackNavigator<MoreStackParamList>();

const RequestStack = (): React.ReactElement => {
  return (
    <RequestStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <RequestStackNavigator.Screen name={ScreenKeys.RequestsDashboard} component={RequestDashboard} />
    </RequestStackNavigator.Navigator>
  );
};

export default RequestStack;
