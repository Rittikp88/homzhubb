import React from 'react';
import { PickerItemProps, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { OffersVisitsType } from '@homzhub/common/src/components/molecules/OffersVisitsSection';
import { AnimatedProfileHeader, AssetMetricsList, BottomSheetListView } from '@homzhub/mobile/src/components';
import AssetCard from '@homzhub/mobile/src/components/organisms/AssetCard';
import { Asset, DataType } from '@homzhub/common/src/domain/models/Asset';
import { AssetFilter, Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import {
  IGetPropertiesPayload,
  IGetTenanciesPayload,
  ISetAssetPayload,
} from '@homzhub/common/src/modules/portfolio/interfaces';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

interface IStateProps {
  tenancies: Asset[] | null;
  properties: Asset[] | null;
  isTenanciesLoading: boolean;
  currentFilter: Filters;
}

interface IDispatchProps {
  getTenanciesDetails: (payload: IGetTenanciesPayload) => void;
  getPropertyDetails: (payload: IGetPropertiesPayload) => void;
  setCurrentAsset: (payload: ISetAssetPayload) => void;
  setCurrentFilter: (payload: Filters) => void;
  setAssetId: (payload: number) => void;
}

interface IPortfolioState {
  isBottomSheetVisible: boolean;
  metrics: AssetMetrics;
  filters: PickerItemProps[];
  isLoading: boolean;
  isSpinnerLoading: boolean;
  expandedTenanciesId: number;
  expandedAssetId: number;
  assetType: string;
}

type libraryProps = NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.PortfolioLandingScreen>;
type Props = WithTranslation & libraryProps & IStateProps & IDispatchProps;

export class Portfolio extends React.PureComponent<Props, IPortfolioState> {
  public focusListener: any;

  public state = {
    isBottomSheetVisible: false,
    metrics: {} as AssetMetrics,
    filters: [],
    isLoading: false,
    isSpinnerLoading: false,
    expandedTenanciesId: 0,
    expandedAssetId: 0,
    assetType: '',
  };

  public componentDidMount = (): void => {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.getScreenData().then();
    });
  };

  public componentWillUnmount(): void {
    this.focusListener();
  }

  public render = (): React.ReactElement => {
    const { t, tenancies, properties, currentFilter, isTenanciesLoading } = this.props;
    const { isBottomSheetVisible, metrics, filters, isSpinnerLoading, assetType, isLoading } = this.state;
    return (
      <>
        <AnimatedProfileHeader
          isGradientHeader
          loading={isLoading || isTenanciesLoading || isSpinnerLoading}
          title={t('portfolio')}
        >
          <>
            <AssetMetricsList
              title={`${metrics?.assetMetrics?.assets?.count ?? 0}`}
              data={metrics?.assetMetrics?.assetGroups ?? []}
              subscription={metrics?.userServicePlan?.label}
              onPlusIconClicked={this.handleAddProperty}
              onMetricsClicked={this.onMetricsClicked}
              selectedAssetType={assetType}
              numOfElements={2}
            />
            {tenancies && tenancies.length > 0 && this.renderTenancies(tenancies)}
            {this.renderPortfolio(properties)}
            <BottomSheetListView
              data={filters}
              selectedValue={currentFilter}
              listTitle={t('propertySearch:filters')}
              listHeight={500}
              isBottomSheetVisible={isBottomSheetVisible}
              onCloseDropDown={this.closeBottomSheet}
              onSelectItem={this.onSelectFilter}
            />
          </>
        </AnimatedProfileHeader>
      </>
    );
  };

  private renderTenancies = (tenancies: Asset[]): React.ReactElement => {
    const { t } = this.props;
    const { assetType } = this.state;
    return (
      <>
        <Text type="small" textType="semiBold" style={styles.title}>
          {t('tenancies')}
        </Text>
        {(assetType
          ? tenancies.filter((item) => item.assetGroup.name === assetType)
          : tenancies
        ).map((tenancy, index) => this.renderList(tenancy, index, DataType.TENANCIES))}
      </>
    );
  };

  private renderPortfolio = (properties: Asset[] | null): React.ReactElement => {
    const { t, currentFilter } = this.props;
    const { assetType } = this.state;
    const title = currentFilter === Filters.ALL ? t('noPropertiesAdded') : t('noFilterProperties');

    const data = assetType ? (properties ?? []).filter((item) => item.assetGroup.name === assetType) : properties;

    const isEmpty = !data || data.length <= 0;

    return (
      <>
        <View style={styles.headingView}>
          <Text type="small" textType="semiBold" style={styles.title}>
            {t('propertyPortfolio')}
          </Text>
          <Icon
            name={icons.verticalDots}
            color={theme.colors.darkTint4}
            size={18}
            onPress={this.handleBottomSheet}
            testID="menu"
          />
        </View>
        {isEmpty ? (
          <EmptyState title={title} icon={icons.home} containerStyle={styles.emptyView} />
        ) : (
          data?.map((property, index) => this.renderList(property, index, DataType.PROPERTIES))
        )}
      </>
    );
  };

  private renderList = (item: Asset, index: number, type: DataType): React.ReactElement => {
    const { expandedAssetId, expandedTenanciesId } = this.state;
    const handleViewProperty = (data: ISetAssetPayload, key?: Tabs): void =>
      this.onViewProperty({ ...data, dataType: type }, key);
    const handleArrowPress = (id: number): void => this.handleExpandCollapse(id, type);
    return (
      <AssetCard
        assetData={item}
        key={index}
        expandedId={type === DataType.PROPERTIES ? expandedAssetId : expandedTenanciesId}
        isFromTenancies={type === DataType.TENANCIES}
        onViewProperty={handleViewProperty}
        onPressArrow={handleArrowPress}
        onCompleteDetails={this.onCompleteDetails}
        onOfferVisitPress={this.onOfferVisitPress}
      />
    );
  };

  private onSelectFilter = (value: Filters): void => {
    const { setCurrentFilter } = this.props;
    setCurrentFilter(value);
    this.setState({ expandedAssetId: 0 }, (): void => {
      this.getPortfolioProperty(true);
    });
    this.closeBottomSheet();
  };

  private onViewProperty = (data: ISetAssetPayload, key?: Tabs): void => {
    const { navigation, setCurrentAsset } = this.props;
    setCurrentAsset(data);
    navigation.navigate(ScreensKeys.PropertyDetailScreen, {
      isFromTenancies: data.dataType === DataType.TENANCIES,
      ...(key && { tabKey: key }),
    });
  };

  private onMetricsClicked = (name: string): void => {
    const { assetType } = this.state;
    if (assetType === name) {
      name = '';
    }
    this.setState({ assetType: name });
  };

  private onPropertiesCallback = (): void => {
    this.verifyData();
    this.setState({ isSpinnerLoading: false, isLoading: false });
  };

  private onTenanciesCallback = (): void => {
    this.verifyData();
  };

  private onOfferVisitPress = (type: OffersVisitsType): void => {};

  private onCompleteDetails = (assetId: number): void => {
    const { navigation, setAssetId } = this.props;
    setAssetId(assetId);
    navigation.navigate(ScreensKeys.PropertyPostStack, {
      screen: ScreensKeys.AddProperty,
      params: { previousScreen: ScreensKeys.Dashboard },
    });
  };

  private getScreenData = async (): Promise<void> => {
    await this.getAssetMetrics();
    await this.getAssetFilters();
    this.getTenancies();
    this.getPortfolioProperty();
  };

  private handleExpandCollapse = (id: number, type: DataType): void => {
    const { expandedAssetId, expandedTenanciesId } = this.state;
    if (type === DataType.PROPERTIES) {
      this.setState({ expandedAssetId: expandedAssetId === id ? 0 : id });
    } else {
      this.setState({ expandedTenanciesId: expandedTenanciesId === id ? 0 : id });
    }
  };

  private closeBottomSheet = (): void => {
    this.setState({ isBottomSheetVisible: false });
  };

  private getAssetMetrics = async (): Promise<void> => {
    this.setState({ isLoading: true });
    try {
      const response: AssetMetrics = await PortfolioRepository.getAssetMetrics();
      this.setState({ metrics: response, isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false });
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private getAssetFilters = async (): Promise<void> => {
    this.setState({ isLoading: true });
    try {
      const response: AssetFilter[] = await PortfolioRepository.getAssetFilters();
      const filterData: PickerItemProps[] = response.map(
        (item): PickerItemProps => {
          return {
            label: item.title,
            value: item.label,
          };
        }
      );
      this.setState({ filters: filterData, isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false });
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private getTenancies = (): void => {
    const { getTenanciesDetails } = this.props;
    getTenanciesDetails({ onCallback: this.onTenanciesCallback });
  };

  private getPortfolioProperty = (isFromFilter?: boolean): void => {
    const { getPropertyDetails, currentFilter } = this.props;
    if (isFromFilter) {
      this.setState({ isSpinnerLoading: true });
    } else {
      this.setState({ isLoading: true });
    }
    getPropertyDetails({ status: currentFilter, onCallback: this.onPropertiesCallback });
  };

  private handleBottomSheet = (): void => {
    const { isBottomSheetVisible } = this.state;
    this.setState({ isBottomSheetVisible: !isBottomSheetVisible });
  };

  private handleAddProperty = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PropertyPostStack, { screen: ScreensKeys.AssetLocationSearch });
  };

  private verifyData = (): void => {
    const { tenancies, properties } = this.props;

    if ((tenancies && tenancies.length > 0) || (properties && properties.length > 0)) {
      if (tenancies && tenancies.length > 0) {
        this.setState({
          expandedTenanciesId: tenancies[0].id,
        });
      }

      if (properties && properties.length > 0) {
        this.setState({
          expandedAssetId: properties[0].id,
        });
      }
    }
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    tenancies: PortfolioSelectors.getTenancies(state),
    properties: PortfolioSelectors.getProperties(state),
    currentFilter: PortfolioSelectors.getCurrentFilter(state),
    isTenanciesLoading: PortfolioSelectors.getTenanciesLoadingState(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getTenanciesDetails, getPropertyDetails, setCurrentAsset, setCurrentFilter } = PortfolioActions;
  const { setAssetId } = RecordAssetActions;
  return bindActionCreators(
    { getTenanciesDetails, getPropertyDetails, setCurrentAsset, setCurrentFilter, setAssetId },
    dispatch
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(Portfolio));

const styles = StyleSheet.create({
  title: {
    color: theme.colors.darkTint1,
    marginBottom: 16,
    marginTop: 4,
  },
  headingView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyView: {
    minHeight: 200,
  },
});
