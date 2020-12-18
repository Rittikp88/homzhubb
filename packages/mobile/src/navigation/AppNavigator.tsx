import React from 'react';
import { useSelector } from 'react-redux';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import {
  IBookVisitProps,
  IWebviewProps,
  NestedNavigatorParams,
  ScreensKeys,
} from '@homzhub/mobile/src/navigation/interfaces';
import { BottomTabNavigatorParamList, BottomTabs } from '@homzhub/mobile/src/navigation/BottomTabs';
import { PropertyPostStack, PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { WebViewScreen } from '@homzhub/mobile/src/screens/common/WebViewScreen';
import AddRecordScreen from '@homzhub/mobile/src/screens/Asset/Financials/AddRecordScreen';
import BookVisit from '@homzhub/mobile/src/screens/Asset/Search/BookVisit';

export type AppStackParamList = {
  [ScreensKeys.PropertyPostLandingScreen]: undefined;
  [ScreensKeys.BottomTabs]: NestedNavigatorParams<BottomTabNavigatorParamList>;
  [ScreensKeys.PropertyPostStack]: NestedNavigatorParams<PropertyPostStackParamList>;
  [ScreensKeys.AddRecordScreen]: { assetId?: number };
  [ScreensKeys.WebViewScreen]: IWebviewProps;
  [ScreensKeys.BookVisit]: IBookVisitProps;
};

const AppStackNavigator = createStackNavigator<AppStackParamList>();

export function AppNavigator(): React.ReactElement {
  const isAddPropertyFlow = useSelector(UserSelector.isAddPropertyFlow);

  return (
    <AppStackNavigator.Navigator
      initialRouteName={isAddPropertyFlow ? ScreensKeys.PropertyPostStack : ScreensKeys.BottomTabs}
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <AppStackNavigator.Screen name={ScreensKeys.BottomTabs} component={BottomTabs} />
      <AppStackNavigator.Screen name={ScreensKeys.PropertyPostStack} component={PropertyPostStack} />
      <AppStackNavigator.Screen name={ScreensKeys.AddRecordScreen} component={AddRecordScreen} />
      <AppStackNavigator.Screen name={ScreensKeys.WebViewScreen} component={WebViewScreen} />
      <AppStackNavigator.Screen name={ScreensKeys.BookVisit} component={BookVisit} />
    </AppStackNavigator.Navigator>
  );
}
