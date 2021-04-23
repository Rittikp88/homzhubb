import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { CommonParamList, getCommonScreen } from '@homzhub/mobile/src/navigation/Common';
import Financials from '@homzhub/mobile/src/screens/Asset/Financials';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

export type FinancialsNavigatorParamList = {
  [ScreensKeys.FinancialsLandingScreen]: undefined;
} & CommonParamList;

const FinancialsNavigator = createStackNavigator<FinancialsNavigatorParamList>();
const commonScreen = getCommonScreen(FinancialsNavigator);

export const FinancialsStack = (): React.ReactElement => {
  return (
    <FinancialsNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <FinancialsNavigator.Screen name={ScreensKeys.FinancialsLandingScreen} component={Financials} />
      {commonScreen}
    </FinancialsNavigator.Navigator>
  );
};
