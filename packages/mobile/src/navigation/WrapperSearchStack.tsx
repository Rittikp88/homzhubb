import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabs } from '@homzhub/mobile/src/navigation/BottomTabs';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import AssetSearchLanding from '@homzhub/mobile/src/screens/Asset/Search/AssetSearchLanding';

export type WrapperSearchStackParamList = {
  [ScreensKeys.PropertySearchLanding]: undefined;
  [ScreensKeys.BottomTabs]: undefined;
};

const WrapperSearchStackNavigator = createStackNavigator<WrapperSearchStackParamList>();

export const WrapperSearchStack = (): React.ReactElement => {
  return (
    <WrapperSearchStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
      mode="modal"
    >
      <WrapperSearchStackNavigator.Screen name={ScreensKeys.PropertySearchLanding} component={AssetSearchLanding} />
      <WrapperSearchStackNavigator.Screen name={ScreensKeys.BottomTabs} component={BottomTabs} />
    </WrapperSearchStackNavigator.Navigator>
  );
};
