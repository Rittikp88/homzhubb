import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { CommonParamList, getCommonScreen } from '@homzhub/mobile/src/navigation/Common';
import PostAssetDetails from '@homzhub/mobile/src/screens/Asset/Record/PostAssetDetails';
import { IAssetLocationMapProps, ScreensKeys, IPostAssetDetailsProps } from '@homzhub/mobile/src/navigation/interfaces';
import AssetLocationMap from '@homzhub/mobile/src/screens/Asset/Record/AssetLocationMap';
import AssetLocationSearch from '@homzhub/mobile/src/screens/Asset/Record/AssetLocationSearch';
import AddProperty from '@homzhub/mobile/src/screens/Asset/Record/AddProperty';
import AssetPlanSelection from '@homzhub/mobile/src/screens/Asset/Record/AssetPlanSelection';
import AssetListing from '@homzhub/mobile/src/screens/Asset/Record/AssetListing';

export type PropertyPostStackParamList = {
  [ScreensKeys.AssetLocationSearch]: undefined | { isFromPortfolio: boolean };
  [ScreensKeys.AssetLocationMap]: IAssetLocationMapProps;
  [ScreensKeys.PostAssetDetails]: IPostAssetDetailsProps | { status: string } | undefined;
  [ScreensKeys.AddProperty]: undefined | { previousScreen: string };
  [ScreensKeys.AssetPlanSelection]: undefined;
  [ScreensKeys.AssetListing]: undefined | { previousScreen: string; isEditFlow?: boolean };
} & CommonParamList;

const PropertyPostStackNavigator = createStackNavigator<PropertyPostStackParamList>();
const commonScreen = getCommonScreen(PropertyPostStackNavigator);

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
      <PropertyPostStackNavigator.Screen name={ScreensKeys.AssetListing} component={AssetListing} />
      <PropertyPostStackNavigator.Screen name={ScreensKeys.AddProperty} component={AddProperty} />
      {commonScreen}
    </PropertyPostStackNavigator.Navigator>
  );
};
