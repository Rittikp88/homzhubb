import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ComingSoon from '@homzhub/ffm/src/screens/Common/ComingSoon';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

type AppStackParamList = {
  [ScreenKeys.Dashboard]: undefined;
};

const AppStackNavigator = createStackNavigator<AppStackParamList>();

const AppStack = (): React.ReactElement => {
  return (
    <AppStackNavigator.Navigator>
      <AppStackNavigator.Screen name={ScreenKeys.Dashboard} component={ComingSoon} />
    </AppStackNavigator.Navigator>
  );
};

export default AppStack;
