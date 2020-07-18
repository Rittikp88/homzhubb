import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { GeolocationResponse } from '@react-native-community/geolocation';
import { debounce } from 'lodash';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { GooglePlaceData } from '@homzhub/common/src/services/GooglePlaces/interfaces';
import { GooglePlacesService } from '@homzhub/common/src/services/GooglePlaces/GooglePlacesService';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, SelectionPicker, Text, WithShadowView } from '@homzhub/common/src/components';
import { CurrentLocation } from '@homzhub/mobile/src/components/molecules/CurrentLocation';
import { PriceRange } from '@homzhub/mobile/src/components/molecules/PriceRange';
import { SearchBar } from '@homzhub/mobile/src/components/molecules/SearchBar';
import { SearchResults } from '@homzhub/mobile/src/components/molecules/SearchResults';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ICurrency, IFilterDetails, IFilter } from '@homzhub/common/src/domain/models/Search';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';

interface IStateProps {
  filterData: IFilterDetails | null;
  filters: IFilter;
}

// TODO: (Shikha) Need to add types
interface IDispatchProps {
  getFilterDetails: (payload: any) => void;
  setFilter: (payload: any) => void;
}

type libraryProps = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.PropertySearchLanding>;
type Props = IStateProps & IDispatchProps & libraryProps;

interface ILandingState {
  searchString: string;
  isSearchBarFocused: boolean;
  suggestions: GooglePlaceData[];
  selectedPropertyType: number;
  selectedLookingType: number;
  maxPriceRange: number;
  minPriceRange: number;
}

class PropertySearchLanding extends React.PureComponent<Props, ILandingState> {
  private searchBar: typeof SearchBar | null = null;

  public state = {
    searchString: '',
    isSearchBarFocused: false,
    suggestions: [],
    selectedPropertyType: 0,
    selectedLookingType: 0,
    maxPriceRange: 0,
    minPriceRange: 0,
  };

  public componentDidMount = (): void => {
    const { getFilterDetails, filters } = this.props;
    const { asset_group, asset_transaction_type } = filters;
    this.setState({
      selectedPropertyType: asset_group,
      selectedLookingType: asset_transaction_type,
    });
    getFilterDetails({ asset_group: filters.asset_group });
  };

  public componentDidUpdate = (prevProps: Props): void => {
    const { filters, getFilterDetails } = this.props;
    if (prevProps.filters.asset_group !== filters.asset_group) {
      getFilterDetails({ asset_group: filters.asset_group });
    }
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({
      selectedPropertyType: filters.asset_group,
      selectedLookingType: filters.asset_transaction_type,
    });
  };

  public render(): React.ReactElement {
    const { isSearchBarFocused } = this.state;
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
            containerStyle={styles.buttonStyle}
            onPress={this.onShowProperties}
          />
        </WithShadowView>
      </>
    );
  }

  private renderContent = (filterData: IFilterDetails): React.ReactElement => {
    const { selectedPropertyType, selectedLookingType, minPriceRange, maxPriceRange } = this.state;
    const { t } = this.props;
    const {
      currency,
      asset_group_list,
      filters: { transaction_type },
    } = filterData;
    let priceRange = { min: 0, max: 0 };
    let currencySymbol = '';

    const assetGroup = asset_group_list.map((item, index) => {
      return { title: item.title, value: item.id };
    });

    const currencyData = currency.map((item: ICurrency) => {
      currencySymbol = item.currency_symbol;
      return {
        label: item.currency_code,
        value: item.currency_code,
      };
    });

    const assetTransaction = transaction_type.map((item, index) => {
      return { title: item.title, value: index };
    });

    transaction_type.forEach((item, index) => {
      if (index === selectedLookingType) {
        priceRange = { min: item.min_price, max: item.max_price };
      }
    });

    return (
      <View style={styles.content}>
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
        <PriceRange
          currencyData={currencyData}
          currencySymbol={currencySymbol}
          onChangeSlide={this.onSliderValueChange}
          range={priceRange}
          minChangedValue={minPriceRange}
          maxChangedValue={maxPriceRange}
        />
      </View>
    );
  };

  private renderHeader = (): React.ReactNode => {
    const { t } = this.props;
    const { searchString } = this.state;
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
          value={searchString}
          containerStyle={styles.searchBarContainer}
          cancelButtonStyle={styles.cancelButtonStyle}
          cancelTextStyle={styles.cancelTextStyle}
          onFocusChange={this.onSearchBarFocusChange}
        />
      </View>
    );
  };

  private renderSearchResults = (): React.ReactNode => {
    const { searchString, suggestions } = this.state;
    return (
      <>
        <CurrentLocation onGetCurrentPositionSuccess={this.onGetCurrentPositionSuccess} />
        {suggestions.length > 0 && searchString.length > 0 && (
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
    this.setState({ searchString }, () => {
      if (searchString.length <= 0) {
        return;
      }
      this.getAutocompleteSuggestions();
    });
  };

  private onSuggestionPress = (place: GooglePlaceData): void => {
    if (this.searchBar) {
      // @ts-ignore
      this.searchBar.SearchTextInput.blur();
    }
  };

  private onGetCurrentPositionSuccess = (data: GeolocationResponse): void => {
    const {
      coords: { latitude, longitude },
    } = data;
    console.log(latitude, longitude);
  };

  private onShowProperties = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PropertyTabsScreen);
  };

  // eslint-disable-next-line react/sort-comp
  private getAutocompleteSuggestions = debounce((): void => {
    const { searchString } = this.state;
    GooglePlacesService.autoComplete(searchString)
      .then((suggestions: GooglePlaceData[]) => {
        this.setState({ suggestions });
      })
      .catch((e: Error): void => {
        AlertHelper.error({ message: e.message });
      });
  }, 300);

  private onSliderValueChange = (value1: number, value2?: number): void => {
    this.setState({
      minPriceRange: value1,
      maxPriceRange: value2 || 0,
    });
  };

  private onChangeProperty = (value: number): void => {
    const { setFilter } = this.props;
    this.setState({ minPriceRange: 0, maxPriceRange: 0 });
    setFilter({ asset_group: value });
  };

  private onChangeFlow = (value: number): void => {
    const { setFilter } = this.props;
    this.setState({ minPriceRange: 0, maxPriceRange: 0 });
    setFilter({ asset_transaction_type: 0 });
  };
}

export const mapStateToProps = (state: IState): IStateProps => {
  return {
    filterData: SearchSelector.getFilterDetail(state),
    filters: SearchSelector.getFilters(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getFilterDetails, setFilter } = SearchActions;
  return bindActionCreators(
    {
      getFilterDetails,
      setFilter,
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
  },
  label: {
    color: theme.colors.darkTint4,
    marginVertical: 20,
  },
});
