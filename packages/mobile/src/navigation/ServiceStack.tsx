import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { CommonParamList, getCommonScreen } from '@homzhub/mobile/src/navigation/Common';
import ServicesDashboard from '@homzhub/mobile/src/screens/Asset/More/Services';
import { ServicesForSelectedAsset } from '@homzhub/mobile/src/screens/Asset/More/ServicesForSelectedAsset';
import { ValueAddedServices } from '@homzhub/mobile/src/screens/Asset/More/Services/ValueAddedServices';
import { IServicesForSelectAssetParams, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

export type ServiceNavigatorParamList = {
  [ScreensKeys.ServicesDashboard]: undefined | { isFromNavigation: boolean };
  [ScreensKeys.ValueAddedServices]: undefined;
  [ScreensKeys.ServicesForSelectedAsset]: IServicesForSelectAssetParams;
} & CommonParamList;

const ServiceNavigator = createStackNavigator<ServiceNavigatorParamList>();
const commonScreen = getCommonScreen(ServiceNavigator);

export const ServiceStack = (): React.ReactElement => {
  return (
    <ServiceNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <ServiceNavigator.Screen name={ScreensKeys.ServicesDashboard} component={ServicesDashboard} />
      <ServiceNavigator.Screen name={ScreensKeys.ValueAddedServices} component={ValueAddedServices} />
      <ServiceNavigator.Screen name={ScreensKeys.ServicesForSelectedAsset} component={ServicesForSelectedAsset} />
      {commonScreen}
    </ServiceNavigator.Navigator>
  );
};
