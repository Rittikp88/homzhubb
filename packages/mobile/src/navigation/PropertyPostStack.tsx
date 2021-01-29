import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import PostAssetDetails from '@homzhub/mobile/src/screens/Asset/Record/PostAssetDetails';
import {
  IAssetLocationMapProps,
  IMarkdownProps,
  ScreensKeys,
  IPostAssetDetailsProps,
} from '@homzhub/mobile/src/navigation/interfaces';
import { MarkdownView } from '@homzhub/mobile/src/screens/Asset/MarkdownView';
import AssetLocationMap from '@homzhub/mobile/src/screens/Asset/Record/AssetLocationMap';
import AssetLocationSearch from '@homzhub/mobile/src/screens/Asset/Record/AssetLocationSearch';
import AddProperty from '@homzhub/mobile/src/screens/Asset/Record/AddProperty';
import AssetPlanSelection from '@homzhub/mobile/src/screens/Asset/Record/AssetPlanSelection';
import AssetLeaseListing from '@homzhub/mobile/src/screens/Asset/Record/AssetLeaseListing';

export type PropertyPostStackParamList = {
  [ScreensKeys.AssetLocationSearch]: undefined | { isFromPortfolio: boolean };
  [ScreensKeys.AssetLocationMap]: IAssetLocationMapProps;
  [ScreensKeys.PostAssetDetails]: IPostAssetDetailsProps | { status: string } | undefined;
  [ScreensKeys.AddProperty]: undefined | { previousScreen: string };
  [ScreensKeys.AssetPlanSelection]: undefined;
  [ScreensKeys.AssetLeaseListing]: undefined | { previousScreen: string; isEditFlow?: boolean };
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
      <PropertyPostStackNavigator.Screen name={ScreensKeys.AssetLocationSearch} component={AssetLocationSearch} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.AssetLocationMap} component={AssetLocationMap} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.PostAssetDetails} component={PostAssetDetails} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.AssetPlanSelection} component={AssetPlanSelection} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.AssetLeaseListing} component={AssetLeaseListing} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.AddProperty} component={AddProperty} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.MarkdownScreen} component={MarkdownView} />
    </PropertyPostStackNavigator.Navigator>
  );
};
