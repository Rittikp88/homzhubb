import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  ScreensKeys,
  IAssetDescriptionProps,
  IContactProps,
  NestedNavigatorParams,
  IBookVisitProps,
} from '@homzhub/mobile/src/navigation/interfaces';
import { AuthStack, AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import AssetDescription from '@homzhub/mobile/src/screens/Asset/Search/AssetDescription';
import AssetNeighbourhood from '@homzhub/mobile/src/screens/Asset/Search/AssetNeighbourhood';
import { AssetReviews } from '@homzhub/mobile/src/screens/Asset/Search/AssetReviews';
import ContactForm from '@homzhub/mobile/src/screens/Asset/Search/ContactForm';
import AssetFilters from '@homzhub/mobile/src/screens/Asset/Search/AssetFilters';
import AssetSearchScreen from '@homzhub/mobile/src/screens/Asset/Search/AssetSearchScreen';
import BookVisit from '@homzhub/mobile/src/screens/Asset/Search/BookVisit';
import ProspectProfile from '@homzhub/mobile/src/screens/Asset/More/Offers/ProspectProfile';
import SubmitOfferForm from '@homzhub/mobile/src/screens/Asset/More/Offers/SubmitOfferForm';
import { PropertyPostStack, PropertyPostStackParamList } from '@homzhub/mobile/src/navigation/PropertyPostStack';
import { IGetListingReviews } from '@homzhub/common/src/domain/repositories/interfaces';

export type SearchStackParamList = {
  [ScreensKeys.PropertySearchScreen]: undefined;
  [ScreensKeys.PropertyAssetDescription]: IAssetDescriptionProps;
  [ScreensKeys.AuthStack]: NestedNavigatorParams<AuthStackParamList>;
  [ScreensKeys.AssetNeighbourhood]: undefined;
  [ScreensKeys.PropertyFilters]: undefined;
  [ScreensKeys.ContactForm]: IContactProps;
  [ScreensKeys.BookVisit]: IBookVisitProps;
  [ScreensKeys.PropertyPostStack]: NestedNavigatorParams<PropertyPostStackParamList>;
  [ScreensKeys.AssetReviews]: IGetListingReviews;
  [ScreensKeys.ProspectProfile]: IAssetDescriptionProps;
  [ScreensKeys.SubmitOffer]: undefined;
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
      <SearchStackNavigator.Screen name={ScreensKeys.AssetReviews} component={AssetReviews} />
      <SearchStackNavigator.Screen name={ScreensKeys.AuthStack} component={AuthStack} />
      <SearchStackNavigator.Screen name={ScreensKeys.AssetNeighbourhood} component={AssetNeighbourhood} />
      <SearchStackNavigator.Screen name={ScreensKeys.PropertyFilters} component={AssetFilters} />
      <SearchStackNavigator.Screen name={ScreensKeys.ContactForm} component={ContactForm} />
      <SearchStackNavigator.Screen name={ScreensKeys.BookVisit} component={BookVisit} />
      <SearchStackNavigator.Screen name={ScreensKeys.PropertyPostStack} component={PropertyPostStack} />
      <SearchStackNavigator.Screen name={ScreensKeys.ProspectProfile} component={ProspectProfile} />
      <SearchStackNavigator.Screen name={ScreensKeys.SubmitOffer} component={SubmitOfferForm} />
    </SearchStackNavigator.Navigator>
  );
};
