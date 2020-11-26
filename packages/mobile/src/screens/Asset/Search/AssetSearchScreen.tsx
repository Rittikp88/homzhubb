import React, { PureComponent } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, TouchableOpacity, PickerItemProps } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { GeolocationResponse } from '@homzhub/common/src/services/Geolocation/interfaces';
import { debounce, cloneDeep } from 'lodash';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { GooglePlaceData, GooglePlaceDetail, Point } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { SearchStackParamList } from '@homzhub/mobile/src/navigation/SearchStack';
import { ILeadPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { LeadService } from '@homzhub/common/src/services/LeadService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button, ButtonType } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label, Text, FontWeightType } from '@homzhub/common/src/components/atoms/Text';
import { ToggleButton } from '@homzhub/common/src/components/atoms/ToggleButton';
import { IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { CurrentLocation, Loader, Range, RoomsFilter } from '@homzhub/mobile/src/components';
import AssetTypeFilter from '@homzhub/mobile/src/components/organisms/AssetTypeFilter';
import SearchResults from '@homzhub/mobile/src/components/molecules/SearchResults';
import GoogleSearchBar from '@homzhub/mobile/src/components/molecules/GoogleSearchBar';
import PropertySearchList from '@homzhub/mobile/src/components/organisms/PropertySearchList';
import PropertySearchMap from '@homzhub/mobile/src/components/organisms/PropertySearchMap';
import { ICarpetArea, IFilter, IFilterDetails, ITransactionRange } from '@homzhub/common/src/domain/models/Search';
import { AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { CarpetArea } from '@homzhub/common/src/domain/models/CarpetArea';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { Currency } from '@homzhub/common/src/domain/models/Currency';

export enum OnScreenFilters {
  TYPE = 'TYPE',
  PRICE = 'PRICE',
  ROOMS = 'ROOMS',
  AREA = 'AREA',
  MORE = 'MORE',
}

interface IStateProps {
  properties: AssetSearch;
  filterData: IFilterDetails | null;
  filters: IFilter;
  isLoading: boolean;
  currencyData: PickerItemProps[];
  priceRange: ITransactionRange;
  searchLocation: Point;
  countryData: Country[];
  isLoggedIn: boolean;
  defaultCurrency: Currency;
}

interface IDispatchProps {
  setFilter: (payload: IFilter) => void;
  getProperties: () => void;
  getPropertiesListView: () => void;
  setInitialFilters: () => void;
  setInitialState: () => void;
  setChangeStack: (flag: boolean) => void;
  getFilterDetails: (payload: any) => void;
}

interface IPropertySearchScreenState {
  isMapView: boolean;
  selectedOnScreenFilter: OnScreenFilters | string;
  isMenuTrayCollapsed: boolean;
  isSearchBarFocused: boolean;
  suggestions: GooglePlaceData[];
  areaUnits: IDropdownOption[];
  favouriteProperties: number[];
}

type libraryProps = WithTranslation & NavigationScreenProps<SearchStackParamList, ScreensKeys.PropertySearchScreen>;
type Props = libraryProps & IStateProps & IDispatchProps;

export class AssetSearchScreen extends PureComponent<Props, IPropertySearchScreenState> {
  private searchBar: typeof GoogleSearchBar | null = null;
  private focusListener: any;
  public state = {
    isMapView: true,
    selectedOnScreenFilter: '',
    isMenuTrayCollapsed: false,
    suggestions: [],
    isSearchBarFocused: false,
    areaUnits: [],
    favouriteProperties: [],
  };

  public componentDidMount = async (): Promise<void> => {
    const { filterData, filters, getFilterDetails, getProperties, navigation, setFilter, defaultCurrency } = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      setFilter({ offset: 0 });
      if (!filters.currency_code) {
        setFilter({
          currency_code: defaultCurrency.currencyCode,
        });
      }

      getProperties();
    });
    if (!filterData) {
      getFilterDetails({ asset_group: filters.asset_group });
    }
    try {
      const response = await CommonRepository.getCarpetAreaUnits();
      const areaUnitsDropdown: IDropdownOption[] = [];
      response.forEach((carpetArea: CarpetArea) => {
        areaUnitsDropdown.push({
          value: carpetArea.id,
          label: carpetArea.title,
        });
      });
      this.setState({
        areaUnits: areaUnitsDropdown,
      });
    } catch (error) {
      AlertHelper.error({ message: error.message });
    }
  };

  public componentDidUpdate = (prevProps: Props): void => {
    const {
      filters: { search_address },
    } = this.props;
    if (prevProps.filters.search_address !== search_address) {
      this.getAutocompleteSuggestions();
    }
  };

  public componentWillUnmount(): void {
    const { setChangeStack } = this.props;
    setChangeStack(true);
  }

  public render(): React.ReactNode {
    const { isLoading } = this.props;
    return (
      <>
        <View style={styles.statusBar}>
          <StatusBar translucent backgroundColor={theme.colors.white} barStyle="dark-content" />
        </View>
        <SafeAreaView style={styles.container}>
          {this.renderFilterTray()}
          {this.renderContent()}
          {this.renderSearchContainer()}
          {this.renderBar()}
        </SafeAreaView>
        <Loader visible={isLoading} />
      </>
    );
  }

  private renderMenuTray = (): React.ReactElement | null => {
    const { isMenuTrayCollapsed } = this.state;
    if (!isMenuTrayCollapsed) {
      return null;
    }
    return <View style={styles.trayContainer}>{this.renderCollapsibleTray()}</View>;
  };

  private renderContent = (): React.ReactElement | null => {
    const { isMapView, favouriteProperties } = this.state;
    const { properties, setFilter, filters, getPropertiesListView, searchLocation } = this.props;
    if (!properties) {
      return null;
    }
    return (
      <View style={styles.flexFour}>
        {isMapView ? (
          <>
            <PropertySearchMap
              properties={properties.results}
              transaction_type={filters.asset_transaction_type || 0}
              onSelectedProperty={this.navigateToAssetDetails}
              onFavorite={this.onFavourite}
              favIds={favouriteProperties}
              searchLocation={searchLocation}
            />
            {this.renderNoResults()}
            {this.renderMenuTray()}
          </>
        ) : (
          <>
            <PropertySearchList
              properties={properties}
              filters={filters}
              setFilter={setFilter}
              favIds={favouriteProperties}
              getPropertiesListView={getPropertiesListView}
              onFavorite={this.onFavourite}
              onSelectedProperty={this.navigateToAssetDetails}
            />
            {this.renderNoResultsListView()}
            {this.renderMenuTray()}
          </>
        )}
      </View>
    );
  };

  private renderNoResults = (): React.ReactElement | null => {
    const { properties, t } = this.props;
    if (properties.count > 0) {
      return null;
    }
    return (
      <View style={styles.noResultsContainer}>
        <Text type="small" textType="regular" style={styles.noResults}>
          {t('noResultsMapView')}
        </Text>
      </View>
    );
  };

  private renderNoResultsListView = (): React.ReactElement | null => {
    const { properties, t } = this.props;
    if (properties.count > 0) {
      return null;
    }
    return (
      <View style={styles.noResultsListContainer}>
        <Icon name={icons.search} size={30} color={theme.colors.disabledSearch} />
        <Text type="small" textType="semiBold" style={styles.noResultText}>
          {t('common:noResultsFound')}
        </Text>
        <Label type="large" textType="regular" style={styles.helperText}>
          {t('noResultHelper')}
        </Label>
        <Button type="primary" title={t('searchAgain')} containerStyle={styles.button} onPress={this.toggleSearchBar} />
        <Label type="large" textType="semiBold" style={styles.resetFilters} onPress={this.resetFilterAndProperties}>
          {t('resetFilters')}
        </Label>
      </View>
    );
  };

  private renderCollapsibleTray = (): React.ReactElement | null => {
    const { selectedOnScreenFilter, areaUnits } = this.state;
    const {
      filterData,
      countryData,
      filters: {
        room_count,
        bath_count,
        asset_group,
        asset_type,
        min_price,
        max_price,
        min_area,
        max_area,
        area_unit,
        currency_code,
      },
      setFilter,
      currencyData,
      getProperties,
      priceRange,
      getFilterDetails,
    } = this.props;
    let currencySymbol = '';
    let areaRange = { min: 0, max: 10 };

    if (!filterData) {
      return null;
    }

    const {
      currency,
      filters: { carpet_area },
    } = filterData;

    // TODO: Handle Multiple currency
    const country = countryData.find((item) => item.currencies[0].currencyCode === currency_code);

    currencySymbol = country?.currencies[0].currencySymbol ?? currency[0].currency_symbol;

    const updateFilter = (type: string, value: number | number[]): void => {
      setFilter({ [type]: value });
      if (type === 'min_price' || type === 'max_price' || type === 'min_area' || type === 'max_area') {
        setTimeout(() => {
          getProperties();
        }, 500);
      } else {
        getProperties();
        if (type === 'asset_group') {
          getFilterDetails({ asset_group: value });
        }
      }
    };

    if (carpet_area) {
      carpet_area.forEach((units: ICarpetArea) => {
        if (units.id === area_unit) {
          areaRange = {
            min: units.min_area,
            max: units.max_area,
          };
        }
      });
    }

    switch (selectedOnScreenFilter) {
      case OnScreenFilters.PRICE:
        return (
          <Range
            dropdownData={currencyData}
            selectedUnit={currency_code}
            isPriceRange
            range={priceRange}
            currencySymbol={currencySymbol}
            minChangedValue={min_price ?? 0}
            maxChangedValue={max_price ?? 0}
            onChangeSlide={updateFilter}
            containerStyle={styles.priceRange}
          />
        );
      case OnScreenFilters.AREA:
        return (
          <Range
            dropdownData={areaUnits}
            selectedUnit={area_unit}
            range={areaRange}
            minChangedValue={min_area ?? 0}
            maxChangedValue={max_area ?? 0}
            onChangeSlide={updateFilter}
            onDropdownValueChange={this.handleDropdownValue}
            containerStyle={styles.priceRange}
          />
        );
      case OnScreenFilters.ROOMS:
        return <RoomsFilter bedCount={room_count ?? []} bathroomCount={[bath_count ?? 0]} onSelection={updateFilter} />;
      case OnScreenFilters.TYPE:
        return (
          <AssetTypeFilter
            filterData={filterData}
            asset_group={asset_group ?? 0}
            asset_type={asset_type ?? []}
            updateAssetFilter={updateFilter}
          />
        );
      default:
        return null;
    }
  };

  private renderSearchContainer = (): React.ReactElement | null => {
    const { isSearchBarFocused } = this.state;
    const {
      filters: { search_address },
    } = this.props;
    const { t } = this.props;
    if (!isSearchBarFocused) {
      return null;
    }
    return (
      <View style={styles.searchLocation}>
        <GoogleSearchBar
          // @ts-ignore
          onRef={(input: SearchBar): void => {
            this.searchBar = input;
          }}
          placeholder={t('enterLocation')}
          updateValue={this.onSearchStringUpdate}
          value={search_address ?? ''}
          autoFocus
          containerStyle={styles.searchBarContainer}
          cancelButtonStyle={styles.cancelButtonStyle}
          cancelTextStyle={styles.cancelTextStyle}
          onFocusChange={this.onSearchBarFocusChange}
        />
        {this.renderSearchResults()}
      </View>
    );
  };

  private renderFilterTray = (): React.ReactElement | null => {
    const {
      t,
      filters: { search_address, asset_group },
    } = this.props;
    const { selectedOnScreenFilter, isMenuTrayCollapsed } = this.state;
    const onScreenFilters = [
      { type: OnScreenFilters.TYPE, label: t('type') },
      { type: OnScreenFilters.PRICE, label: t('price') },
      {
        type: asset_group === 1 ? OnScreenFilters.ROOMS : OnScreenFilters.AREA, // asset_group=1 is RESIDENTIAL
        label: asset_group === 1 ? t('rooms') : t('area'),
      },
      { type: OnScreenFilters.MORE, label: icons.filter },
    ];
    return (
      <>
        <View style={styles.filterTray}>
          <TouchableOpacity onPress={this.toggleSearchBar}>
            <View style={styles.addressContainer}>
              <Icon name={icons.search} size={20} color={theme.colors.darkTint5} />
              <Text type="small" textType="regular" style={styles.address} numberOfLines={1}>
                {search_address}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.menuTrayContainer}>
            {onScreenFilters.map((item: { type: OnScreenFilters; label: string }, index: number) => {
              const { type, label } = item;
              let buttonType: ButtonType = 'secondary';
              let fontWeight: FontWeightType = 'regular';
              let iconColor = theme.colors.primaryColor;
              if (selectedOnScreenFilter === type) {
                buttonType = 'primary';
                fontWeight = 'semiBold';
                iconColor = theme.colors.secondaryColor;
              }

              const onPress = (): void => {
                this.setState({ selectedOnScreenFilter: type, isMenuTrayCollapsed: true });
                if (type === selectedOnScreenFilter && isMenuTrayCollapsed) {
                  this.setState({
                    isMenuTrayCollapsed: false,
                  });
                }
              };

              const navigateToFilters = (): void => {
                const { navigation } = this.props;
                navigation.navigate(ScreensKeys.PropertyFilters);
              };

              if (index === 3) {
                return (
                  <Button
                    key={type}
                    type={buttonType}
                    icon={label}
                    iconColor={iconColor}
                    iconSize={20}
                    onPress={navigateToFilters}
                    iconStyle={styles.menuButtonText}
                    containerStyle={styles.filterButtons}
                  />
                );
              }
              return (
                <Button
                  key={type}
                  title={label}
                  type={buttonType}
                  textType="label"
                  textSize="regular"
                  fontType={fontWeight}
                  onPress={onPress}
                  containerStyle={styles.filterButtons}
                  titleStyle={styles.menuButtonText}
                />
              );
            })}
          </View>
        </View>
        <Divider />
      </>
    );
  };

  private renderSearchResults = (): React.ReactElement | null => {
    const { suggestions } = this.state;
    const {
      filters: { search_address },
    } = this.props;
    return (
      <>
        <CurrentLocation onGetCurrentPositionSuccess={this.onGetCurrentPositionSuccess} />
        {suggestions.length > 0 && !!search_address && search_address.length > 0 && (
          <SearchResults
            results={suggestions}
            onResultPress={this.onSuggestionPress}
            listTitleStyle={styles.resultListContainer}
          />
        )}
      </>
    );
  };

  private renderBar = (): React.ReactElement | null => {
    const { isMapView, isMenuTrayCollapsed, isSearchBarFocused } = this.state;
    const { t, properties } = this.props;
    if (!properties) return null;
    if (isMenuTrayCollapsed || isSearchBarFocused) {
      return null;
    }
    const conditionalStyle = isMapView ? styles.flexRow : styles.flexRowReverse;
    return (
      <View style={[styles.bar, conditionalStyle]}>
        {isMapView && (
          <View style={styles.propertiesFound}>
            <Label type="regular" textType="regular">
              {(properties && properties.count) ?? 0} {t('propertiesFound')}
            </Label>
          </View>
        )}
        <ToggleButton
          onToggle={this.handleToggle}
          title={isMapView ? t('common:list') : t('common:map')}
          icon={isMapView ? icons.list : icons.map}
        />
      </View>
    );
  };

  private onFavourite = async (propertyTermId: number, isFavourite: boolean): Promise<void> => {
    const { navigation, isLoggedIn, setChangeStack } = this.props;

    if (!isLoggedIn) {
      setChangeStack(false);
      navigation.navigate(ScreensKeys.AuthStack, {
        screen: ScreensKeys.SignUp,
        params: { onCallback: (): Promise<void> => this.handleFavoriteProperty(propertyTermId, isFavourite, true) },
      });
    } else {
      await this.handleFavoriteProperty(propertyTermId, isFavourite);
    }
  };

  private onSearchStringUpdate = (searchString: string): void => {
    const { setFilter } = this.props;
    setFilter({ search_address: searchString });
    this.getAutocompleteSuggestions();
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
      })
      .catch(this.displayError);
  };

  private onSuggestionPress = (place: GooglePlaceData): void => {
    const { setFilter, getProperties } = this.props;
    GooglePlacesService.getPlaceDetail(place.place_id)
      .then((placeDetail: GooglePlaceDetail) => {
        this.setSearchedPropertyCurrency(placeDetail);
        setFilter({
          search_address: place.description,
          search_latitude: placeDetail.geometry.location.lat,
          search_longitude: placeDetail.geometry.location.lng,
        });
        getProperties();
      })
      .catch(this.displayError);
    if (this.searchBar) {
      // @ts-ignore
      this.searchBar.SearchTextInput.blur();
    }
  };

  public onSearchBarFocusChange = (isSearchBarFocused: boolean): void => {
    this.setState({ isSearchBarFocused });
  };

  private handleFavoriteProperty = async (
    propertyTermId: number,
    isFavourite: boolean,
    isFromLogin?: boolean
  ): Promise<void> => {
    const {
      navigation,
      filters: { asset_transaction_type },
    } = this.props;
    const { favouriteProperties } = this.state;

    if (isFromLogin) {
      navigation.navigate(ScreensKeys.PropertySearchScreen);
    }

    const payload: ILeadPayload = {
      propertyTermId,
      data: {
        lead_type: 'WISHLIST',
        is_wishlisted: !isFavourite,
        user_search: null,
      },
    };

    let favProperties: number[] = cloneDeep(favouriteProperties);

    try {
      await LeadService.postLeadDetail(asset_transaction_type || 0, payload);
      if (favProperties.includes(propertyTermId)) {
        favProperties = favProperties.filter((item) => item !== propertyTermId);
      } else {
        favProperties.push(propertyTermId);
      }
      this.setState({
        favouriteProperties: favProperties,
      });
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  public toggleSearchBar = (): void => {
    const { isSearchBarFocused } = this.state;
    this.setState({ isSearchBarFocused: !isSearchBarFocused });
  };

  private displayError = (e: Error): void => {
    AlertHelper.error({ message: e.message });
  };

  // eslint-disable-next-line react/sort-comp
  private getAutocompleteSuggestions = debounce((): void => {
    const {
      filters: { search_address },
    } = this.props;
    GooglePlacesService.autoComplete(search_address || '')
      .then((suggestions: GooglePlaceData[]) => {
        this.setState({ suggestions });
      })
      .catch((e: Error): void => {
        AlertHelper.error({ message: e.message });
      });
  }, 300);

  private handleToggle = (): void => {
    const { isMapView } = this.state;
    this.setState({
      isMapView: !isMapView,
    });
  };

  private handleDropdownValue = (value: string | number): void => {
    const { setFilter, getProperties } = this.props;
    setFilter({
      area_unit: value as number,
      min_area: -1,
      max_area: -1,
    });
    getProperties();
  };

  public resetFilterAndProperties = (): void => {
    const { getProperties, setInitialFilters } = this.props;
    setInitialFilters();
    getProperties();
  };

  public navigateToAssetDetails = (propertyTermId: number, propertyId: number): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PropertyAssetDescription, {
      propertyTermId,
      propertyId,
    });
  };

  private setSearchedPropertyCurrency = (placeDetail: GooglePlaceDetail): void => {
    const { countryData, setFilter } = this.props;
    const placeCountry = placeDetail.address_components.find((address) => address.types.includes('country'));
    const country = countryData.find((item) => item.iso2Code === placeCountry?.short_name);
    setFilter({
      currency_code: country?.currencies[0].currencyCode,
    });
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const {
    getProperties,
    getFilters,
    getFilterDetail,
    getLoadingState,
    getCurrencyData,
    getPriceRange,
    getSearchLocationLatLong,
  } = SearchSelector;
  const { isLoggedIn } = UserSelector;
  const { getCountryList, getDefaultCurrency } = CommonSelectors;
  return {
    properties: getProperties(state),
    filterData: getFilterDetail(state),
    filters: getFilters(state),
    isLoading: getLoadingState(state),
    currencyData: getCurrencyData(state),
    priceRange: getPriceRange(state),
    searchLocation: getSearchLocationLatLong(state),
    isLoggedIn: isLoggedIn(state),
    countryData: getCountryList(state),
    defaultCurrency: getDefaultCurrency(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const {
    setFilter,
    getFilterDetails,
    getProperties,
    setInitialFilters,
    setInitialState,
    getPropertiesListView,
  } = SearchActions;
  const { setChangeStack } = UserActions;
  return bindActionCreators(
    {
      setFilter,
      getProperties,
      setInitialFilters,
      setInitialState,
      getPropertiesListView,
      setChangeStack,
      getFilterDetails,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.propertySearch)(AssetSearchScreen));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexFour: {
    flex: 4,
  },
  statusBar: {
    height: PlatformUtils.isIOS() ? 30 : StatusBar.currentHeight,
    backgroundColor: theme.colors.background,
  },
  bar: {
    position: 'absolute',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: theme.viewport.height * 0.2,
    width: theme.viewport.width,
    paddingHorizontal: theme.layout.screenPadding,
  },
  menuTrayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 5,
    paddingVertical: 10,
    flex: 0,
  },
  filterButtons: {
    flex: 0,
  },
  menuButtonText: {
    marginVertical: 8,
    marginHorizontal: 20,
  },
  propertiesFound: {
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  trayContainer: {
    width: '100%',
    backgroundColor: theme.colors.white,
    padding: 15,
    paddingTop: 10,
    position: 'absolute',
    top: 0,
    borderRadius: 4,
  },
  searchBarContainer: {
    backgroundColor: theme.colors.white,
  },
  cancelButtonStyle: {
    backgroundColor: theme.colors.white,
  },
  cancelTextStyle: {
    color: theme.colors.primaryColor,
  },
  resultListContainer: {
    backgroundColor: theme.colors.white,
  },
  searchLocation: {
    backgroundColor: theme.colors.white,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  filterTray: {
    flex: 1,
    backgroundColor: theme.colors.white,
    justifyContent: 'space-around',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: theme.colors.darkTint12,
    borderWidth: 1,
    margin: theme.layout.screenPadding,
    marginBottom: 10,
    padding: 8,
  },
  address: {
    marginStart: 15,
    width: 220,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexRowReverse: {
    flexDirection: 'row-reverse',
  },
  noResults: {
    textAlign: 'center',
    color: theme.colors.darkTint4,
  },
  noResultsContainer: {
    position: 'absolute',
    bottom: 20,
    padding: 7,
    width: 250,
    alignSelf: 'center',
    borderRadius: 4,
    backgroundColor: theme.colors.white,
  },
  priceRange: {
    width: theme.viewport.width,
    paddingRight: 30,
  },
  noResultsListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultText: {
    color: theme.colors.darkTint3,
    marginVertical: 10,
  },
  helperText: {
    color: theme.colors.darkTint6,
    textAlign: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  resetFilters: {
    color: theme.colors.primaryColor,
    marginVertical: 10,
  },
  button: {
    flex: 0,
    marginVertical: 10,
  },
});
