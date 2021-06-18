import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { CommonParamList, getCommonScreen } from '@homzhub/mobile/src/navigation/Common';
import { SearchStack } from '@homzhub/mobile/src/navigation/SearchStack';
import { ReferEarn } from '@homzhub/mobile/src/screens/Asset/More/ReferEarn';
import Settings from '@homzhub/mobile/src/screens/Asset/More/Settings';
import { KYCDocuments } from '@homzhub/mobile/src/screens/Asset/More/KYCDocuments';
import AddPropertyImage from '@homzhub/mobile/src/screens/Asset/More/Services/AddPropertyImage';
import SubscriptionPayment from '@homzhub/mobile/src/screens/Asset/More/SubscriptionPayment';
import More from '@homzhub/mobile/src/screens/Asset/More';
import { IPropertyImageParam, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

export type MoreStackNavigatorParamList = {
  [ScreensKeys.MoreScreen]: undefined;
  [ScreensKeys.SettingsScreen]: undefined;
  [ScreensKeys.ReferEarn]: undefined;
  [ScreensKeys.KYC]: undefined;
  [ScreensKeys.AddServiceTicket]: undefined;
  [ScreensKeys.SubscriptionPayment]: undefined;
  [ScreensKeys.AddPropertyImage]: IPropertyImageParam;
  [ScreensKeys.Search]: undefined;
} & CommonParamList;

const MoreStackNavigator = createStackNavigator<MoreStackNavigatorParamList>();
const commonScreen = getCommonScreen(MoreStackNavigator);

export const MoreStack = (): React.ReactElement => {
  return (
    <MoreStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <MoreStackNavigator.Screen name={ScreensKeys.MoreScreen} component={More} />
      <MoreStackNavigator.Screen name={ScreensKeys.SettingsScreen} component={Settings} />
      <MoreStackNavigator.Screen name={ScreensKeys.ReferEarn} component={ReferEarn} />
      <MoreStackNavigator.Screen name={ScreensKeys.KYC} component={KYCDocuments} />
      <MoreStackNavigator.Screen name={ScreensKeys.SubscriptionPayment} component={SubscriptionPayment} />
      <MoreStackNavigator.Screen name={ScreensKeys.AddPropertyImage} component={AddPropertyImage} />
      <MoreStackNavigator.Screen name={ScreensKeys.Search} component={SearchStack} />
      {commonScreen}
    </MoreStackNavigator.Navigator>
  );
};
