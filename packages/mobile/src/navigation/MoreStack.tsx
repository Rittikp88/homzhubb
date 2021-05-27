import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { IGetMessageParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { CommonParamList, getCommonScreen } from '@homzhub/mobile/src/navigation/Common';
import { ReferEarn } from '@homzhub/mobile/src/screens/Asset/More/ReferEarn';
import Settings from '@homzhub/mobile/src/screens/Asset/More/Settings';
import GroupChatInfo from '@homzhub/mobile/src/screens/Asset/More/GroupChatInfo';
import { SavedProperties } from '@homzhub/mobile/src/screens/Asset/More/SavedProperties';
import { KYCDocuments } from '@homzhub/mobile/src/screens/Asset/More/KYCDocuments';
import { ServicesForSelectedAsset } from '@homzhub/mobile/src/screens/Asset/More/ServicesForSelectedAsset';
import ServicesDashboard from '@homzhub/mobile/src/screens/Asset/More/Services';
import AddPropertyImage from '@homzhub/mobile/src/screens/Asset/More/Services/AddPropertyImage';
import { ValueAddedServices } from '@homzhub/mobile/src/screens/Asset/More/Services/ValueAddedServices';
import PropertyOfferList from '@homzhub/mobile/src/screens/Asset/More/Offers/PropertyOfferList';
import SubscriptionPayment from '@homzhub/mobile/src/screens/Asset/More/SubscriptionPayment';
import More from '@homzhub/mobile/src/screens/Asset/More';
import {
  IPropertyImageParam,
  IServicesForSelectAssetParams,
  ScreensKeys,
} from '@homzhub/mobile/src/navigation/interfaces';

export type MoreStackNavigatorParamList = {
  [ScreensKeys.MoreScreen]: undefined;
  [ScreensKeys.SettingsScreen]: undefined;
  [ScreensKeys.ReferEarn]: undefined;
  [ScreensKeys.SavedPropertiesScreen]: undefined;
  [ScreensKeys.KYC]: undefined;
  [ScreensKeys.ValueAddedServices]: undefined;
  [ScreensKeys.ServicesForSelectedAsset]: IServicesForSelectAssetParams;
  [ScreensKeys.GroupChatInfo]: IGetMessageParam;
  [ScreensKeys.AddServiceTicket]: undefined;
  [ScreensKeys.PropertyOfferList]: undefined;
  [ScreensKeys.SubscriptionPayment]: undefined;
  [ScreensKeys.ServicesDashboard]: undefined;
  [ScreensKeys.AddPropertyImage]: IPropertyImageParam;
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
      <MoreStackNavigator.Screen name={ScreensKeys.SavedPropertiesScreen} component={SavedProperties} />
      <MoreStackNavigator.Screen name={ScreensKeys.KYC} component={KYCDocuments} />
      <MoreStackNavigator.Screen name={ScreensKeys.ValueAddedServices} component={ValueAddedServices} />
      <MoreStackNavigator.Screen name={ScreensKeys.ServicesForSelectedAsset} component={ServicesForSelectedAsset} />
      <MoreStackNavigator.Screen name={ScreensKeys.GroupChatInfo} component={GroupChatInfo} />
      <MoreStackNavigator.Screen name={ScreensKeys.PropertyOfferList} component={PropertyOfferList} />
      <MoreStackNavigator.Screen name={ScreensKeys.SubscriptionPayment} component={SubscriptionPayment} />
      <MoreStackNavigator.Screen name={ScreensKeys.ServicesDashboard} component={ServicesDashboard} />
      <MoreStackNavigator.Screen name={ScreensKeys.AddPropertyImage} component={AddPropertyImage} />
      {commonScreen}
    </MoreStackNavigator.Navigator>
  );
};
