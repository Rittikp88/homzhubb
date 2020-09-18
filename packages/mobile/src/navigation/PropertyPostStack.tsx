import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { IAddPropertyMapProps, IMarkdownProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { MarkdownView } from '@homzhub/mobile/src/screens/Asset/MarkdownView';
import AssetLocationMap from '@homzhub/mobile/src/screens/Asset/Record/AssetLocationMap';
import AssetLocationSearch from '@homzhub/mobile/src/screens/Asset/Record/AssetLocationSearch';
import AddPropertyScreen from '@homzhub/mobile/src/screens/Asset/Record/AddPropertyScreen';
import PropertyDetails from '@homzhub/mobile/src/screens/Asset/Record/PropertyDetails';
import AssetPlanSelection from '@homzhub/mobile/src/screens/Asset/Record/AssetPlanSelection';
import AssetServiceCheckoutScreen from '@homzhub/mobile/src/screens/Asset/Record/AssetServiceCheckoutScreen';

export type PropertyPostStackParamList = {
  [ScreensKeys.AddPropertyScreen]: undefined;
  [ScreensKeys.PostPropertySearch]: undefined;
  [ScreensKeys.PostPropertyMap]: IAddPropertyMapProps;
  [ScreensKeys.PropertyDetailsScreen]: undefined;
  [ScreensKeys.AssetPlanSelection]: undefined;
  [ScreensKeys.AssetServiceCheckoutScreen]: undefined;
  [ScreensKeys.MarkdownScreen]: IMarkdownProps;
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
      <PropertyPostStackNavigator.Screen name={ScreensKeys.AddPropertyScreen} component={AddPropertyScreen} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.AssetPlanSelection} component={AssetPlanSelection} />
      <PropertyPostStackNavigator.Screen
        name={ScreensKeys.AssetServiceCheckoutScreen}
        component={AssetServiceCheckoutScreen}
      />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.MarkdownScreen} component={MarkdownView} />
    </PropertyPostStackNavigator.Navigator>
  );
};
