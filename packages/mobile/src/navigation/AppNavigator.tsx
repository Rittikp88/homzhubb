import React from 'react';
import { useSelector } from 'react-redux';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { ScreensKeys, NestedNavigatorParams } from '@homzhub/mobile/src/navigation/interfaces';
import { BlankScreen } from '@homzhub/mobile/src/screens/BlankScreen';
import { BottomTabNavigatorParamList, BottomTabs } from '@homzhub/mobile/src/navigation/BottomTabs';
import { PropertyPostStack, PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';

export type AppStackParamList = {
  [ScreensKeys.PropertyPostLandingScreen]: undefined;
  [ScreensKeys.BottomTabs]: NestedNavigatorParams<BottomTabNavigatorParamList>;
  // Todo (Sriram: 2020.09.11) Replace this with not found screen
  [ScreensKeys.BlankScreen]: undefined;
  [ScreensKeys.PropertyPostStack]: NestedNavigatorParams<PropertyPostStackParamList>;
};

const AppStackNavigator = createStackNavigator<AppStackParamList>();

export function AppNavigator(): React.ReactElement {
  const assetCount = useSelector(AssetSelectors.getAssetCount);
  const isAddPropertyFlow = useSelector(UserSelector.isAddPropertyFlow);
  return (
    <AppStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {!isAddPropertyFlow && assetCount > 0 ? (
        <AppStackNavigator.Screen name={ScreensKeys.BottomTabs} component={BottomTabs} />
      ) : (
        <AppStackNavigator.Screen name={ScreensKeys.PropertyPostStack} component={PropertyPostStack} />
      )}
      <AppStackNavigator.Screen name={ScreensKeys.BlankScreen} component={BlankScreen} />
    </AppStackNavigator.Navigator>
  );
}
