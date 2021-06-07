import React from 'react';
import { PickerItemProps, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { AssetMetricsList } from '@homzhub/mobile/src/components';
import AssetCard from '@homzhub/mobile/src/components/organisms/AssetCard';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Asset, DataType } from '@homzhub/common/src/domain/models/Asset';
import { AssetFilter, Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/PortfolioStack';
import { NavigationScreenProps, ScreensKeys, UpdatePropertyFormTypes } from '@homzhub/mobile/src/navigation/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import {
  IGetPropertiesPayload,
  IGetTenanciesPayload,
  IPortfolioState,
  ISetAssetPayload,
} from '@homzhub/common/src/modules/portfolio/interfaces';
import { Tabs } from '@homzhub/common/src/constants/Tabs';
import {
  ClosureReasonType,
  IClosureReasonPayload,
  IListingParam,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';

interface IStateProps {
  tenancies: Asset[] | null;
  properties: Asset[] | null;
  currentFilter: Filters;
  loaders: IPortfolioState['loaders'];
}

interface IDispatchProps {
  getTenanciesDetails: (payload: IGetTenanciesPayload) => void;
  getPropertyDetails: (payload: IGetPropertiesPayload) => void;
  setCurrentAsset: (payload: ISetAssetPayload) => void;
  setCurrentFilter: (payload: Filters) => void;
  setEditPropertyFlow: (payload: boolean) => void;
  setAssetId: (payload: number) => void;
  clearMessages: () => void;
  clearAssetData: () => void;
}

interface IScreenState {
  metrics: AssetMetrics;
  filters: PickerItemProps[];
  expandedTenanciesId: number;
  expandedAssetId: number;
  assetType: string;
}

type libraryProps = NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.PortfolioLandingScreen>;
type Props = WithTranslation & libraryProps & IStateProps & IDispatchProps;

export class Portfolio extends React.PureComponent<Props, IScreenState> {
  public focusListener: any;

  public state = {
    metrics: {} as AssetMetrics,
    filters: [],
    expandedTenanciesId: 0,
    expandedAssetId: 0,
    assetType: '',
  };

  public componentDidMount = (): void => {
    const {
      navigation,
      clearMessages,
      setAssetId,
      route: { params },
    } = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      if (params) {
        this.acceptInvite().then();
      }
      this.getScreenData().then();
      clearMessages();
      setAssetId(-1);
      this.setState({
        assetType: '',
      });
    });
  };

  public componentWillUnmount(): void {
    this.focusListener();
  }

  public render = (): React.ReactElement => {
    const { t, tenancies, properties, loaders } = this.props;
    const { metrics, assetType } = this.state;
    return (
      <UserScreen isGradient loading={loaders.tenancies || loaders.properties} title={t('portfolio')}>
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
      </UserScreen>
    );
  };

  private renderTenancies = (tenancies: Asset[]): React.ReactElement | null => {
    const { t } = this.props;
    const { assetType } = this.state;
    const filteredData = tenancies.filter((item) => item.assetGroup.name === assetType);

    if (assetType && filteredData.length < 1) {
      return null;
    }

    return (
      <>
        <Text type="small" textType="semiBold" style={styles.title}>
          {t('tenancies')}
        </Text>
        {(assetType ? filteredData : tenancies).map((tenancy, index) =>
          this.renderList(tenancy, index, DataType.TENANCIES)
        )}
      </>
    );
  };

  private renderPortfolio = (properties: Asset[] | null): React.ReactElement => {
    const { t, currentFilter } = this.props;
    const { assetType, filters } = this.state;
    const title = currentFilter === Filters.ALL ? t('noPropertiesAdded') : t('noFilterProperties');

    const data = assetType ? (properties ?? []).filter((item) => item.assetGroup.name === assetType) : properties;
    const filterValue = currentFilter.replace('_', ' ');
    const filteredData =
      currentFilter === Filters.ALL ? data : data?.filter((item) => item.assetStatusInfo?.tag.label === filterValue);

    const isEmpty = !filteredData || filteredData.length <= 0;

    return (
      <>
        <View style={[styles.headingView, isEmpty && styles.headerMargin]}>
          <Text type="small" textType="semiBold" style={styles.title}>
            {t('propertyPortfolio')}
          </Text>
          <Dropdown
            data={filters}
            value={currentFilter}
            onDonePress={this.onSelectFilter}
            textStyle={styles.placeholder}
            listHeight={500}
            listTitle={t('propertySearch:filters')}
            backgroundColor={theme.colors.white}
            iconColor={theme.colors.blue}
            iconStyle={styles.dropdownIcon}
            icon={icons.downArrow}
            containerStyle={styles.dropdownContainer}
            fontSize="large"
            fontWeight="semiBold"
            isOutline
          />
        </View>
        {isEmpty ? (
          <EmptyState title={title} icon={icons.home} containerStyle={styles.emptyView} />
        ) : (
          filteredData?.map((property, index) => this.renderList(property, index, DataType.PROPERTIES))
        )}
      </>
    );
  };

  private renderList = (item: Asset, index: number, type: DataType): React.ReactElement => {
    const { expandedAssetId, expandedTenanciesId } = this.state;
    const handleViewProperty = (data: ISetAssetPayload, key?: Tabs): void =>
      this.onViewProperty({ ...data, dataType: type }, key);
    const handleArrowPress = (id: number): void => this.handleExpandCollapse(id, type);
    const onPressAction = (payload: IClosureReasonPayload, param?: IListingParam): void => {
      this.handleActions(item, payload, param);
    };
    return (
      <AssetCard
        assetData={item}
        key={index}
        expandedId={type === DataType.PROPERTIES ? expandedAssetId : expandedTenanciesId}
        isFromTenancies={type === DataType.TENANCIES}
        onViewProperty={handleViewProperty}
        onPressArrow={handleArrowPress}
        onCompleteDetails={this.onCompleteDetails}
        onHandleAction={onPressAction}
        onResend={this.onResendInvite}
      />
    );
  };

  private onSelectFilter = (value: Filters): void => {
    const { setCurrentFilter } = this.props;
    setCurrentFilter(value);
    this.setState({ expandedAssetId: 0 });
  };

  private onViewProperty = (data: ISetAssetPayload, key?: Tabs): void => {
    const { navigation, setCurrentAsset } = this.props;
    setCurrentAsset(data);
    navigation.navigate(ScreensKeys.PropertyDetailScreen, {
      isFromTenancies: data.dataType === DataType.TENANCIES,
      ...(key && { tabKey: key }),
    });
  };

  private onResendInvite = async (tenantId: number): Promise<void> => {
    try {
      await AssetRepository.inviteTenant(tenantId);
      this.getPortfolioProperty();
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
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
  };

  private onTenanciesCallback = (): void => {
    this.verifyData();
  };

  private onCompleteDetails = (assetId: number): void => {
    const { navigation, setAssetId, setEditPropertyFlow } = this.props;
    setAssetId(assetId);
    setEditPropertyFlow(true);
    // @ts-ignore
    navigation.navigate(ScreensKeys.PropertyPostStack, {
      screen: ScreensKeys.AddProperty,
      params: { previousScreen: ScreensKeys.Dashboard },
    });
  };

  private acceptInvite = async (): Promise<void> => {
    const {
      route: { params },
    } = this.props;
    try {
      await AssetRepository.acceptInvite(params);
    } catch (error) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(error.details) });
    }
  };

  private getScreenData = async (): Promise<void> => {
    this.getTenancies();
    this.getPortfolioProperty();
    await this.getAssetMetrics();
    await this.getAssetFilters();
  };

  private handleExpandCollapse = (id: number, type: DataType): void => {
    const { expandedAssetId, expandedTenanciesId } = this.state;
    if (type === DataType.PROPERTIES) {
      this.setState({ expandedAssetId: expandedAssetId === id ? 0 : id });
    } else {
      this.setState({ expandedTenanciesId: expandedTenanciesId === id ? 0 : id });
    }
  };

  private getAssetMetrics = async (): Promise<void> => {
    try {
      const response: AssetMetrics = await PortfolioRepository.getAssetMetrics();
      this.setState({ metrics: response });
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private getAssetFilters = async (): Promise<void> => {
    try {
      const response: AssetFilter = await PortfolioRepository.getAssetFilters();
      this.setState({ filters: response.statusDropdown });
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private getTenancies = (): void => {
    const { getTenanciesDetails } = this.props;
    getTenanciesDetails({ onCallback: this.onTenanciesCallback });
  };

  private getPortfolioProperty = (): void => {
    const { getPropertyDetails } = this.props;
    getPropertyDetails({ onCallback: this.onPropertiesCallback });
  };

  private handleActions = (asset: Asset, payload: IClosureReasonPayload, param?: IListingParam): void => {
    const { navigation, setAssetId } = this.props;
    const { id, isSubleased, assetStatusInfo } = asset;
    setAssetId(id);
    const { CancelListing, TerminateListing } = UpdatePropertyFormTypes;
    const { LEASE_TRANSACTION_TERMINATION } = ClosureReasonType;
    const formType = payload.type === LEASE_TRANSACTION_TERMINATION ? TerminateListing : CancelListing;
    const startDate = DateUtils.getUtcFormatted(assetStatusInfo?.leaseTransaction.leaseEndDate ?? '', 'DD/MM/YYYY');

    if (param && param.hasTakeAction) {
      navigation.navigate(ScreensKeys.AssetPlanSelection, {
        isFromPortfolio: true,
        isSubleased,
        leaseUnit: assetStatusInfo?.leaseUnitId ?? undefined,
        startDate: DateUtils.getFutureDateByUnit(startDate, 1, 'days'),
      });
    } else {
      navigation.navigate(ScreensKeys.UpdatePropertyScreen, { formType, payload, param, assetDetail: asset });
    }
  };

  private handleAddProperty = (): void => {
    const { navigation, clearAssetData } = this.props;
    clearAssetData();
    // @ts-ignore
    navigation.navigate(ScreensKeys.PropertyPostStack, { screen: ScreensKeys.AssetLocationSearch });
    AnalyticsService.track(EventType.AddPropertyInitiation);
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
    loaders: PortfolioSelectors.getPortfolioLoaders(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getTenanciesDetails, getPropertyDetails, setCurrentAsset, setCurrentFilter } = PortfolioActions;
  const { setAssetId, setEditPropertyFlow, clearAssetData } = RecordAssetActions;
  const { clearMessages } = CommonActions;
  return bindActionCreators(
    {
      getTenanciesDetails,
      getPropertyDetails,
      setCurrentAsset,
      setCurrentFilter,
      setAssetId,
      setEditPropertyFlow,
      clearMessages,
      clearAssetData,
    },
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
    marginTop: 8,
  },
  headerMargin: {
    marginTop: 12,
  },
  emptyView: {
    minHeight: 200,
  },
  placeholder: {
    color: theme.colors.blue,
  },
  dropdownIcon: {
    marginStart: 12,
  },
  dropdownContainer: {
    backgroundColor: theme.colors.white,
    borderWidth: 0,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    width: 125,
  },
});
