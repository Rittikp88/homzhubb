import React from 'react';
import { View, StyleSheet, StatusBar, PickerItemProps, ScrollView } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PopupActions, PopupProps } from 'reactjs-popup/dist/types';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { SearchSelector } from '@homzhub/common/src/modules/search/selectors';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Range } from '@homzhub/common/src/components/molecules/Range';
import { RoomsFilter } from '@homzhub/common/src/components/molecules/RoomsFilter';
import AssetTypeFilter from '@homzhub/common/src/components/organisms/AssetTypeFilter';
import MoreFilters from '@homzhub/web/src/screens/searchProperty/components/MoreFilter';
import { Country } from '@homzhub/common/src/domain/models/Country';
import { FilterDetail } from '@homzhub/common/src/domain/models/FilterDetail';
import { IFilter, ITransactionRange } from '@homzhub/common/src/domain/models/Search';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';

interface IStateProps {
  filterData: FilterDetail | null;
  filters: IFilter;
  currencyData: PickerItemProps[];
  priceRange: ITransactionRange;
  countryList: Country[];
  isLoading: boolean;
}

interface IDispatchProps {
  getFilterDetails: (payload: IFilter) => void;
  setFilter: (payload: IFilter) => void;
  getProperties: () => void;
  setInitialState: () => void;
}

type Props = IStateProps & IDispatchProps & WithTranslation & IWithMediaQuery;

interface ILandingState {
  isSearchBarFocused: boolean;
  selectedLookingType: number;
  maxPriceRange: number;
  minPriceRange: number;
}

class AssetFilters extends React.PureComponent<Props, ILandingState> {
  private popupRef = React.createRef<PopupActions>();

  public state = {
    isSearchBarFocused: false,
    selectedLookingType: 0,
    maxPriceRange: 0,
    minPriceRange: 0,
  };

  public componentDidMount = (): void => {
    const { getFilterDetails, filters } = this.props;
    const { asset_transaction_type, min_price, max_price } = filters;
    this.setState({
      selectedLookingType: asset_transaction_type ?? 0,
      minPriceRange: min_price ?? 0,
      maxPriceRange: max_price ?? 0,
    });
    getFilterDetails({ asset_group: filters.asset_group });
  };

  public componentDidUpdate = (prevProps: Props): void => {
    const {
      filters: { asset_group, max_price, min_price, search_latitude, asset_transaction_type },
      getFilterDetails,
    } = this.props;

    if (prevProps.filters.asset_group !== asset_group || prevProps.filters.search_latitude !== search_latitude) {
      getFilterDetails({ asset_group });
    }

    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({
      selectedLookingType: asset_transaction_type ?? 0,
      minPriceRange: min_price ?? 0,
      maxPriceRange: max_price ?? 0,
    });
  };

  public componentWillUnmount = (): void => {
    const { setInitialState } = this.props;
    setInitialState();
  };

  public render(): React.ReactElement {
    const { isSearchBarFocused } = this.state;
    const { filterData, isLoading } = this.props;
    return (
      <>
        <View style={styles.statusBar}>
          <StatusBar translucent backgroundColor={theme.colors.background} barStyle="dark-content" />
        </View>
        <View style={styles.screen}>{!isSearchBarFocused && filterData && this.renderContent(filterData)}</View>
        <Loader visible={isLoading} />
      </>
    );
  }

  private renderContent = (filterData: FilterDetail): React.ReactElement => {
    const { selectedLookingType, minPriceRange, maxPriceRange } = this.state;
    const {
      t,
      currencyData,
      priceRange,
      filters: { currency_code, room_count, bath_count, asset_group, asset_type },
      countryList,
      isMobile,
      isTablet,
    } = this.props;
    const {
      currency,
      filters: { transactionType },
    } = filterData;
    let currencySymbol = '';

    // TODO: Handle Multiple currency
    const country = countryList.find((item) => item.currencies[0].currencyCode === currency_code);

    currencySymbol = country?.currencies[0].currencySymbol ?? currency[0].currencySymbol;

    const assetTransaction = transactionType.map((item, index) => {
      return { title: item.title, value: index };
    });

    const closePopover = (): void => {
      if (this.popupRef && this.popupRef.current) this.popupRef.current.close();
    };

    const defaultDropDownProps = (height: number, mobile: boolean | undefined, width = 400): PopupProps => ({
      position: 'bottom left',
      arrow: false,
      contentStyle: {
        minWidth: 10,
        marginTop: 10,
        width: mobile ? '90%' : width,
        height,
      },
      closeOnDocumentClick: false,
      children: undefined,
    });

    const moreFilterDefaultDropDownProps = (mobile: boolean | undefined, tablet: boolean | undefined): PopupProps => ({
      arrow: false,
      contentStyle: {
        minWidth: 10,
        marginTop: isTablet ? 20 : 12,
        width: '90%',
        height: 536,
        marginRight: mobile ? 10 : undefined,
        marginLeft: tablet ? 40 : 64,
      },
      closeOnDocumentClick: false,
      children: undefined,
      className: 'moreFilter',
    });

    const assetFilterButtons = [
      {
        id: 1,
        label: t('offerType'),
        content: (
          <>
            <Typography size="small" variant="text" fontWeight="semiBold" style={styles.filterLabels}>
              {t('lookingFor')}
            </Typography>
            <SelectionPicker
              data={assetTransaction}
              selectedItem={[selectedLookingType]}
              onValueChange={this.onChangeFlow}
              containerStyles={[styles.propertyTypeFilterButtons]}
            />
          </>
        ),
        popupProps: defaultDropDownProps(125, isMobile),
      },
      {
        id: 2,
        label: t('propertyType'),
        content: (
          <View style={styles.propertyTypes}>
            <AssetTypeFilter
              filterData={filterData}
              asset_group={asset_group ?? 0}
              asset_type={asset_type ?? []}
              updateAssetFilter={this.updateFilter}
            />
          </View>
        ),
        popupProps: defaultDropDownProps(400, isMobile, 420),
      },
      {
        id: 3,
        label: t('rooms'),
        content: (
          <View style={styles.roomsAndBaths}>
            <RoomsFilter
              bedCount={room_count ?? []}
              bathroomCount={[bath_count ?? 0]}
              onSelection={this.updateFilter}
            />
          </View>
        ),
        popupProps: defaultDropDownProps(225, isMobile),
      },
      {
        id: 4,
        label: t('priceRange'),
        content: (
          <Range
            dropdownData={currencyData}
            isPriceRange
            selectedUnit={currency_code}
            currencySymbol={currencySymbol}
            onChangeSlide={this.updateFilter}
            range={priceRange}
            minChangedValue={minPriceRange}
            maxChangedValue={maxPriceRange}
            containerStyle={styles.priceRange}
          />
        ),
        popupProps: defaultDropDownProps(180, isMobile),
      },
      {
        id: 5,
        label: t('assetMore:more'),
        content: <MoreFilters closePopover={closePopover} />,
        popupProps: moreFilterDefaultDropDownProps(isMobile, isTablet),
      },
    ];

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        {assetFilterButtons.map((filter) => {
          return (
            <Popover
              content={filter.content}
              popupProps={filter.popupProps}
              key={`${filter.id}-popover`}
              forwardedRef={this.popupRef}
            >
              <Button
                type="secondary"
                title={filter.label}
                containerStyle={styles.filterButtons}
                titleStyle={styles.filterButtonsTitles}
                icon={icons.downArrow}
                iconSize={20}
                iconColor={theme.colors.blue}
                key={`${filter.id}-button`}
              />
            </Popover>
          );
        })}
      </ScrollView>
    );
  };

  private onChangeFlow = (value: number): void => {
    const { setFilter, getProperties } = this.props;
    setFilter({ asset_transaction_type: value, min_price: -1, max_price: -1 });
    getProperties();
  };

  private updateFilter = (type: string, value: number | number[]): void => {
    const { setFilter, getProperties } = this.props;
    setFilter({ [type]: value });
    getProperties();
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
    isLoading: SearchSelector.getLoadingState(state),
    countryList: CommonSelectors.getCountryList(state),
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

const assetFilters = withMediaQuery<Props>(AssetFilters);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.propertySearch)(assetFilters));

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'row',
    width: 'fit-content',
  },
  propertyTypeFilterButtons: {
    width: 340,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  screen: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  statusBar: {
    marginTop: 16,
    height: PlatformUtils.isIOS() ? 30 : StatusBar.currentHeight,
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
    paddingBottom: 0,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
  content: {
    backgroundColor: theme.colors.white,
  },
  contentContainer: {
    padding: theme.layout.screenPadding,
  },
  label: {
    color: theme.colors.darkTint4,
    marginVertical: 20,
  },
  priceRange: {
    marginTop: 25,
    paddingHorizontal: 10,
  },
  backIconStyle: {
    paddingVertical: 16,
    marginBottom: 10,
  },
  roomsAndBaths: {
    width: 390,
    padding: 20,
  },
  filterButtons: {
    flexDirection: 'row',
    height: 31,
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: theme.colors.lightGrayishBlue,
    borderWidth: 0,
  },
  filterButtonsTitles: {
    marginHorizontal: 12,
  },
  filterLabels: {
    color: theme.colors.darkTint4,
    paddingHorizontal: 25,
  },
  propertyTypes: {
    width: 410,
    padding: 5,
  },
});