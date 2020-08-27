import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import {
  IAddPropertyMapProps,
  IMarkdownProps,
  IServiceDataProps,
  IServiceStepProps,
  ScreensKeys,
} from '@homzhub/mobile/src/navigation/interfaces';
import { MarkdownView } from '@homzhub/mobile/src/screens/Asset/MarkdownView';
import AssetLocationMap from '@homzhub/mobile/src/screens/Asset/Record/AssetLocationMap';
import AssetLocationSearch from '@homzhub/mobile/src/screens/Asset/Record/AssetLocationSearch';
import AssetPackageSteps from '@homzhub/mobile/src/screens/Asset/Record/AssetPackageSteps';
import AssetServiceCheckoutSteps from '@homzhub/mobile/src/screens/Asset/Record/AssetServiceCheckoutSteps';
import AssetServiceSelection from '@homzhub/mobile/src/screens/Asset/Record/AssetServiceSelection';
import PropertyDetails from '@homzhub/mobile/src/screens/Asset/Record/PropertyDetails';
import ServiceDetailScreen from '@homzhub/mobile/src/screens/Asset/Record/ServiceDetailScreen';
import ServiceListScreen from '@homzhub/mobile/src/screens/Asset/Record/ServiceListScreen';
import AssetPropertyImages from '@homzhub/mobile/src/screens/Asset/Record/AssetPropertyImages';

export type PropertyPostStackParamList = {
  [ScreensKeys.PostPropertySearch]: undefined;
  [ScreensKeys.PostPropertyMap]: IAddPropertyMapProps;
  [ScreensKeys.PropertyDetailsScreen]: undefined;
  [ScreensKeys.RentServicesScreen]: undefined;
  [ScreensKeys.ServiceListScreen]: IServiceDataProps;
  [ScreensKeys.ServiceDetailScreen]: IServiceDataProps;
  [ScreensKeys.ServiceListSteps]: IServiceStepProps;
  [ScreensKeys.ServiceCheckoutSteps]: undefined;
  [ScreensKeys.MarkdownScreen]: IMarkdownProps;
  [ScreensKeys.AssetPropertyImages]: undefined;
};
const PropertyPostStackNavigator = createStackNavigator<PropertyPostStackParamList>();

export const PropertyPostStack = (): React.ReactElement => {
  return (
    <PropertyPostStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <PropertyPostStackNavigator.Screen name={ScreensKeys.PostPropertySearch} component={AssetLocationSearch} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.PostPropertyMap} component={AssetLocationMap} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.PropertyDetailsScreen} component={PropertyDetails} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.AssetPropertyImages} component={AssetPropertyImages} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.RentServicesScreen} component={AssetServiceSelection} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.ServiceListScreen} component={ServiceListScreen} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.ServiceDetailScreen} component={ServiceDetailScreen} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.ServiceListSteps} component={AssetPackageSteps} />
      <PropertyPostStackNavigator.Screen
        name={ScreensKeys.ServiceCheckoutSteps}
        component={AssetServiceCheckoutSteps}
      />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.MarkdownScreen} component={MarkdownView} />
    </PropertyPostStackNavigator.Navigator>
  );
};
