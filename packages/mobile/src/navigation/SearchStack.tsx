import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  ScreensKeys,
  IAssetDescriptionProps,
  IContactProps,
  NestedNavigatorParams,
} from '@homzhub/mobile/src/navigation/interfaces';
import { AuthStack, AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import AssetDescription from '@homzhub/mobile/src/screens/Asset/Search/AssetDescription';
import AssetNeighbourhood from '@homzhub/mobile/src/screens/Asset/Search/AssetNeighbourhood';
import ContactForm from '@homzhub/mobile/src/screens/Asset/Search/ContactForm';
import AssetFilters from '@homzhub/mobile/src/screens/Asset/Search/AssetFilters';
import AssetSearchScreen from '@homzhub/mobile/src/screens/Asset/Search/AssetSearchScreen';

export type SearchStackParamList = {
  [ScreensKeys.PropertySearchScreen]: undefined;
  [ScreensKeys.PropertyAssetDescription]: IAssetDescriptionProps;
  [ScreensKeys.AuthStack]: NestedNavigatorParams<AuthStackParamList>;
  [ScreensKeys.AssetNeighbourhood]: undefined;
  [ScreensKeys.PropertyFilters]: undefined;
  [ScreensKeys.ContactForm]: IContactProps;
};

const SearchStackNavigator = createStackNavigator<SearchStackParamList>();

export const SearchStack = (): React.ReactElement => {
  return (
    <SearchStackNavigator.Navigator
      screenOptions={{
        headerShown: false,
      }}
      mode="modal"
    >
      <SearchStackNavigator.Screen name={ScreensKeys.PropertySearchScreen} component={AssetSearchScreen} />
      <SearchStackNavigator.Screen name={ScreensKeys.PropertyAssetDescription} component={AssetDescription} />
      <SearchStackNavigator.Screen name={ScreensKeys.AuthStack} component={AuthStack} />
      <SearchStackNavigator.Screen name={ScreensKeys.AssetNeighbourhood} component={AssetNeighbourhood} />
      <SearchStackNavigator.Screen name={ScreensKeys.PropertyFilters} component={AssetFilters} />
      <SearchStackNavigator.Screen name={ScreensKeys.ContactForm} component={ContactForm} />
    </SearchStackNavigator.Navigator>
  );
};
