import React, { PureComponent } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, TouchableOpacity, ScrollView, PickerItemProps } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { GeolocationResponse } from '@react-native-community/geolocation';
import { debounce } from 'lodash';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { GooglePlaceData, GooglePlaceDetail } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button, ButtonType, Divider, FontWeightType, Label, ToggleButton, Text } from '@homzhub/common/src/components';
import { Loader } from '@homzhub/mobile/src/components/atoms/Loader';
import { RoomsFilter } from '@homzhub/mobile/src/components/molecules/RoomsFilter';
import { AssetTypeFilter } from '@homzhub/mobile/src/components/organisms/AssetTypeFilter';
import { PriceRange } from '@homzhub/mobile/src/components/molecules/PriceRange';
import PropertySearchList from '@homzhub/mobile/src/components/organisms/PropertySearchList';
import PropertySearchMap from '@homzhub/mobile/src/components/organisms/PropertySearchMap';
import { SearchBar } from '@homzhub/mobile/src/components/molecules/SearchBar';
import { CurrentLocation } from '@homzhub/mobile/src/components/molecules/CurrentLocation';
import { SearchResults } from '@homzhub/mobile/src/components/molecules/SearchResults';
import {
  ICurrency,
  IFilter,
  IFilterDetails,
  IPropertiesObject,
  ITransactionRange,
} from '@homzhub/common/src/domain/models/Search';

export enum OnScreenFilters {
  TYPE = 'TYPE',
  PRICE = 'PRICE',
  ROOMS = 'ROOMS',
  MORE = 'MORE',
}

interface IStateProps {
  properties: IPropertiesObject;
  filterData: IFilterDetails | null;
  filters: IFilter;
  isLoading: boolean;
  currencyData: PickerItemProps[];
  priceRange: ITransactionRange;
}

// TODO: (Shikha) Need to add types
interface IDispatchProps {
  setFilter: (payload: any) => void;
  getProperties: () => void;
  setInitialFilters: () => void;
  setInitialState: () => void;
}

interface IPropertySearchScreenState {
  isMapView: boolean;
  selectedOnScreenFilter: OnScreenFilters | string;
  isMenuTrayCollapsed: boolean;
  isSearchBarFocused: boolean;
  suggestions: GooglePlaceData[];
}

type Props = WithTranslation & IStateProps & IDispatchProps;

class PropertySearchScreen extends PureComponent<Props, IPropertySearchScreenState> {
  private searchBar: typeof SearchBar | null = null;
  public state = {
    isMapView: true,
    selectedOnScreenFilter: '',
    isMenuTrayCollapsed: false,
    suggestions: [],
    isSearchBarFocused: false,
  };

  public componentDidUpdate = (prevProps: Props): void => {
    const {
      filters: { search_address },
    } = this.props;
    if (prevProps.filters.search_address !== search_address) {
      this.getAutocompleteSuggestions();
    }
  };

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
        {isLoading && <Loader />}
      </>
    );
  }

  private renderMenuTray = (): React.ReactNode => {
    const { isMenuTrayCollapsed } = this.state;
    if (!isMenuTrayCollapsed) {
      return null;
    }
    return <View style={styles.trayContainer}>{this.renderCollapsibleTray()}</View>;
  };

  private renderContent = (): React.ReactNode => {
    const { isMapView } = this.state;
    const { properties, setInitialFilters, getProperties, setFilter, filters } = this.props;
    if (!properties) {
      return null;
    }
    return (
      <View style={styles.flexFour}>
        {isMapView ? (
          <>
            <PropertySearchMap properties={properties.results} transaction_type={filters.asset_transaction_type} />
            {this.renderMenuTray()}
            {this.renderNoResults()}
          </>
        ) : (
          <ScrollView style={styles.flexOne}>
            <PropertySearchList
              properties={properties.results}
              propertyCount={properties.count}
              filters={filters}
              setFilter={setFilter}
              resetFilters={setInitialFilters}
              getProperties={getProperties}
              onFavorite={this.onFavoriteProperty}
              isSearchBarFocused={this.toggleSearchBar}
            />
            {this.renderMenuTray()}
          </ScrollView>
        )}
      </View>
    );
  };

  private renderNoResults = (): React.ReactNode => {
    const { properties } = this.props;
    if (properties.count > 0) {
      return null;
    }
    return (
      <View style={styles.noResultsContainer}>
        <Text type="small" textType="regular" style={styles.noResults}>
          No results found, try zooming or changing your filters
        </Text>
      </View>
    );
  };

  private renderCollapsibleTray = (): React.ReactNode => {
    const { selectedOnScreenFilter } = this.state;
    const {
      filterData,
      filters: { room_count, bath_count, asset_group, asset_type, min_price, max_price },
      setFilter,
      currencyData,
      getProperties,
      priceRange,
    } = this.props;
    let currencySymbol = '';

    if (!filterData) {
      return null;
    }

    const { currency } = filterData;

    currency.forEach((item: ICurrency) => {
      currencySymbol = item.currency_symbol;
    });

    const updateFilter = (type: string, value: number | number[]): void => {
      setFilter({ [type]: value });
      if (type === 'min_price' || type === 'max_price') {
        setTimeout(() => {
          getProperties();
        }, 500);
      } else {
        getProperties();
      }
    };

    switch (selectedOnScreenFilter) {
      case OnScreenFilters.PRICE:
        return (
          <PriceRange
            currencyData={currencyData}
            range={priceRange}
            currencySymbol={currencySymbol}
            minChangedValue={min_price}
            maxChangedValue={max_price}
            onChangeSlide={updateFilter}
          />
        );
      case OnScreenFilters.ROOMS:
        return <RoomsFilter bedCount={room_count} bathroomCount={[bath_count]} onSelection={updateFilter} />;
      case OnScreenFilters.TYPE:
        return (
          <AssetTypeFilter
            filterData={filterData}
            asset_group={asset_group}
            asset_type={asset_type}
            updateAssetFilter={updateFilter}
          />
        );
      default:
        return null;
    }
  };

  private renderSearchContainer = (): React.ReactNode => {
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
        <SearchBar
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

  private renderFilterTray = (): React.ReactNode => {
    const {
      t,
      filters: { search_address },
    } = this.props;
    const { selectedOnScreenFilter, isMenuTrayCollapsed } = this.state;
    const onScreenFilters = [
      { type: OnScreenFilters.TYPE, label: t('type') },
      { type: OnScreenFilters.PRICE, label: t('price') },
      { type: OnScreenFilters.ROOMS, label: t('rooms') },
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

              const onPress = (): void =>
                this.setState({ selectedOnScreenFilter: type, isMenuTrayCollapsed: !isMenuTrayCollapsed });

              const navigateToFilters = (): void => console.log('Navigate to Filters');

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

  private renderSearchResults = (): React.ReactNode => {
    const { suggestions } = this.state;
    const {
      filters: { search_address },
    } = this.props;
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

  private renderBar = (): React.ReactNode => {
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

  public onFavoriteProperty = (propertyId: number): void => {};

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
    GooglePlacesService.autoComplete(search_address)
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
}

const mapStateToProps = (state: IState): IStateProps => {
  const {
    getProperties,
    getFilters,
    getFilterDetail,
    getLoadingState,
    getCurrencyData,
    getPriceRange,
  } = SearchSelector;
  return {
    properties: getProperties(state),
    filterData: getFilterDetail(state),
    filters: getFilters(state),
    isLoading: getLoadingState(state),
    currencyData: getCurrencyData(state),
    priceRange: getPriceRange(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setFilter, getProperties, setInitialFilters, setInitialState } = SearchActions;
  return bindActionCreators(
    {
      setFilter,
      getProperties,
      setInitialFilters,
      setInitialState,
    },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.propertySearch)(PropertySearchScreen));

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexFour: {
    flex: 4,
  },
  flexOne: {
    flex: 1,
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
  },
  filterButtons: {
    flex: 0,
  },
  menuButtonText: {
    marginVertical: 8,
    marginHorizontal: 24,
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
    backgroundColor: theme.colors.white,
    padding: 15,
    paddingTop: 0,
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
    marginBottom: 0,
    padding: 8,
  },
  address: {
    marginStart: 15,
    width: 300,
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
});
