import React from 'react';
import { View, StyleSheet, StatusBar, PickerItemProps, ScrollView } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { GeolocationResponse } from '@react-native-community/geolocation';
import { debounce } from 'lodash';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { GooglePlaceData, GooglePlaceDetail } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, SelectionPicker, Text, WithShadowView } from '@homzhub/common/src/components';
import { CurrentLocation, Range, SearchBar, SearchResults } from '@homzhub/mobile/src/components';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { ICurrency, IFilterDetails, IFilter, ITransactionRange } from '@homzhub/common/src/domain/models/Search';

interface IStateProps {
  filterData: IFilterDetails | null;
  filters: IFilter;
  currencyData: PickerItemProps[];
  priceRange: ITransactionRange;
}

// TODO: (Shikha) Need to add types
interface IDispatchProps {
  getFilterDetails: (payload: any) => void;
  setFilter: (payload: any) => void;
  getProperties: () => void;
  setInitialState: () => void;
}

type libraryProps = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.PropertySearchLanding>;
type Props = IStateProps & IDispatchProps & libraryProps;

interface ILandingState {
  isSearchBarFocused: boolean;
  suggestions: GooglePlaceData[];
  selectedPropertyType: number;
  selectedLookingType: number;
  maxPriceRange: number;
  minPriceRange: number;
  isLocationSelected: boolean;
}

class PropertySearchLanding extends React.PureComponent<Props, ILandingState> {
  private searchBar: typeof SearchBar | null = null;

  public state = {
    isSearchBarFocused: false,
    suggestions: [],
    selectedPropertyType: 0,
    selectedLookingType: 0,
    maxPriceRange: 0,
    minPriceRange: 0,
    isLocationSelected: false,
  };

  public componentDidMount = (): void => {
    const { getFilterDetails, filters } = this.props;
    const { asset_group, asset_transaction_type, min_price, max_price } = filters;
    this.setState({
      selectedPropertyType: asset_group,
      selectedLookingType: asset_transaction_type,
      minPriceRange: min_price,
      maxPriceRange: max_price,
    });
    getFilterDetails({ asset_group: filters.asset_group });
  };

  public componentDidUpdate = (prevProps: Props): void => {
    const {
      filters: {
        asset_group,
        max_price,
        min_price,
        search_latitude,
        search_longitude,
        asset_transaction_type,
        search_address,
      },
      getFilterDetails,
    } = this.props;

    if (prevProps.filters.asset_group !== asset_group || prevProps.filters.search_latitude !== search_latitude) {
      getFilterDetails({ latitude: search_latitude, longitute: search_longitude, asset_group });
    }

    if (prevProps.filters.search_address !== search_address) {
      this.getAutocompleteSuggestions();
    }
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({
      selectedPropertyType: asset_group,
      selectedLookingType: asset_transaction_type,
      minPriceRange: min_price,
      maxPriceRange: max_price,
    });
  };

  public componentWillUnmount = (): void => {
    const { setInitialState } = this.props;
    setInitialState();
  };

  public render(): React.ReactElement {
    const { isSearchBarFocused, isLocationSelected } = this.state;
    const { t, filterData } = this.props;
    return (
      <>
        <View style={styles.statusBar}>
          <StatusBar translucent backgroundColor={theme.colors.background} barStyle="dark-content" />
        </View>
        <View style={styles.screen}>
          {this.renderHeader()}
          {isSearchBarFocused && this.renderSearchResults()}
          {!isSearchBarFocused && filterData && this.renderContent(filterData)}
        </View>
        <WithShadowView outerViewStyle={styles.shadowView}>
          <Button
            type="primary"
            title={t('showProperties')}
            disabled={!isLocationSelected}
            containerStyle={styles.buttonStyle}
            onPress={this.onShowProperties}
          />
        </WithShadowView>
      </>
    );
  }

  private renderContent = (filterData: IFilterDetails): React.ReactElement => {
    const { selectedPropertyType, selectedLookingType, minPriceRange, maxPriceRange } = this.state;
    const { t, currencyData, priceRange } = this.props;
    const {
      currency,
      asset_group_list,
      filters: { transaction_type },
    } = filterData;
    let currencySymbol = '';

    const assetGroup = asset_group_list.map((item, index) => {
      return { title: item.title, value: item.id };
    });

    currency.forEach((item: ICurrency) => {
      currencySymbol = item.currency_symbol;
    });

    const assetTransaction = transaction_type.map((item, index) => {
      return { title: item.title, value: index };
    });

    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text type="small" textType="semiBold" style={styles.label}>
          {t('propertyType')}
        </Text>
        <SelectionPicker
          data={assetGroup}
          selectedItem={[selectedPropertyType]}
          onValueChange={this.onChangeProperty}
        />
        <Text type="small" textType="semiBold" style={styles.label}>
          {t('lookingFor')}
        </Text>
        <SelectionPicker
          data={assetTransaction}
          selectedItem={[selectedLookingType]}
          onValueChange={this.onChangeFlow}
        />
        <Range
          dropdownData={currencyData}
          isPriceRange
          currencySymbol={currencySymbol}
          onChangeSlide={this.updateFilter}
          range={priceRange}
          minChangedValue={minPriceRange}
          maxChangedValue={maxPriceRange}
          containerStyle={styles.priceRange}
        />
      </ScrollView>
    );
  };

  private renderHeader = (): React.ReactNode => {
    const {
      t,
      filters: { search_address },
    } = this.props;
    return (
      <View style={styles.header}>
        <Text type="regular">{t('findingRightProperty')}</Text>
        <Text type="regular" textType="bold" style={styles.madeEasy}>
          {t('madeEasy')}
        </Text>
        <SearchBar
          // @ts-ignore
          onRef={(input: SearchBar): void => {
            this.searchBar = input;
          }}
          placeholder={t('enterLocation')}
          updateValue={this.onSearchStringUpdate}
          value={search_address}
          containerStyle={styles.searchBarContainer}
          cancelButtonStyle={styles.cancelButtonStyle}
          cancelTextStyle={styles.cancelTextStyle}
          onFocusChange={this.onSearchBarFocusChange}
        />
      </View>
    );
  };

  private renderSearchResults = (): React.ReactNode => {
    const {
      filters: { search_address },
    } = this.props;
    const { suggestions } = this.state;
    return (
      <>
        <CurrentLocation onGetCurrentPositionSuccess={this.onGetCurrentPositionSuccess} />
        {suggestions.length > 0 && search_address.length > 0 && (
          <SearchResults
            results={suggestions}
            onResultPress={this.onSuggestionPress}
            listTitleStyle={styles.resultListContainer}
          />
        )}
      </>
    );
  };

  private onSearchBarFocusChange = (isSearchBarFocused: boolean): void => {
    this.setState({ isSearchBarFocused });
  };

  private onSearchStringUpdate = (searchString: string): void => {
    const { setFilter } = this.props;
    setFilter({ search_address: searchString });
    if (searchString.length === 0) {
      this.setState({ isLocationSelected: false });
    }
    this.getAutocompleteSuggestions();
  };

  private onSuggestionPress = (place: GooglePlaceData): void => {
    const { setFilter } = this.props;
    GooglePlacesService.getPlaceDetail(place.place_id)
      .then((placeDetail: GooglePlaceDetail) => {
        setFilter({
          search_address: place.description,
          search_latitude: placeDetail.geometry.location.lat,
          search_longitude: placeDetail.geometry.location.lng,
        });
        this.setState({ isLocationSelected: true });
      })
      .catch(this.displayError);
    if (this.searchBar) {
      // @ts-ignore
      this.searchBar.SearchTextInput.blur();
    }
  };

  private onGetCurrentPositionSuccess = (data: GeolocationResponse): void => {
    const { setFilter } = this.props;
    const {
      coords: { latitude, longitude },
    } = data;
    GooglePlacesService.getLocationData({ lng: longitude, lat: latitude })
      .then((locData) => {
        const { formatted_address } = locData;
        const { primaryAddress, secondaryAddress } = GooglePlacesService.getSplitAddress(formatted_address);
        setFilter({
          search_address: `${primaryAddress} ${secondaryAddress}`,
          search_latitude: latitude,
          search_longitude: longitude,
        });
        this.setState({ isLocationSelected: true });
        if (this.searchBar) {
          // @ts-ignore
          this.searchBar.SearchTextInput.blur();
        }
      })
      .catch(this.displayError);
  };

  private onShowProperties = (): void => {
    const { navigation, getProperties } = this.props;
    getProperties();
    navigation.navigate(ScreensKeys.PropertyTabsScreen);
  };

  // eslint-disable-next-line react/sort-comp
  private getAutocompleteSuggestions = debounce((): void => {
    const {
      filters: { search_address },
    } = this.props;
    GooglePlacesService.autoComplete(search_address)
      .then((suggestions: GooglePlaceData[]) => {
        this.setState({ suggestions });
      })
      .catch((e: Error): void => {
        AlertHelper.error({ message: e.message });
      });
  }, 300);

  private onChangeProperty = (value: number): void => {
    const { setFilter } = this.props;
    setFilter({ asset_group: value, min_price: -1, max_price: -1, asset_transaction_type: 0 });
  };

  private onChangeFlow = (value: number): void => {
    const { setFilter } = this.props;
    setFilter({ asset_transaction_type: value, min_price: -1, max_price: -1 });
  };

  private updateFilter = (type: string, value: number | number[]): void => {
    const { setFilter } = this.props;
    setFilter({ [type]: value });
  };

  private displayError = (e: Error): void => {
    AlertHelper.error({ message: e.message });
  };
}

export const mapStateToProps = (state: IState): IStateProps => {
  return {
    filterData: SearchSelector.getFilterDetail(state),
    filters: SearchSelector.getFilters(state),
    currencyData: SearchSelector.getCurrencyData(state),
    priceRange: SearchSelector.getPriceRange(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getFilterDetails, setFilter, getProperties, setInitialState } = SearchActions;
  return bindActionCreators(
    {
      getFilterDetails,
      setFilter,
      getProperties,
      setInitialState,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, WithTranslation, IState>(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.propertySearch)(PropertySearchLanding));

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  statusBar: {
    marginTop: 16,
    height: PlatformUtils.isIOS() ? 30 : StatusBar.currentHeight,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.layout.screenPadding,
    paddingVertical: 8,
    backgroundColor: theme.colors.background,
  },
  searchBarContainer: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 0,
    paddingBottom: 0,
    paddingTop: 24,
  },
  cancelButtonStyle: {
    backgroundColor: theme.colors.background,
  },
  cancelTextStyle: {
    color: theme.colors.primaryColor,
  },
  resultListContainer: {
    backgroundColor: theme.colors.white,
  },
  madeEasy: {
    marginTop: 6,
  },
  shadowView: {
    paddingTop: 10,
    marginBottom: PlatformUtils.isIOS() ? 20 : 0,
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
  content: {
    backgroundColor: theme.colors.white,
    margin: theme.layout.screenPadding,
    flex: 1,
  },
  label: {
    color: theme.colors.darkTint4,
    marginVertical: 20,
  },
  priceRange: {
    marginVertical: 30,
  },
});
