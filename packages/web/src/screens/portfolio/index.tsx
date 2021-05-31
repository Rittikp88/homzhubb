import React, { createRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { PopupActions } from 'reactjs-popup/dist/types';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { History } from 'history';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import ConfirmationContent from '@homzhub/web/src/components/atoms/ConfirmationContent';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import Popover from '@homzhub/web/src/components/atoms/Popover';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import CancelTerminateListing from '@homzhub/web/src/components/molecules/CancelTerminateListing';
import { AppLayoutContext } from '@homzhub/web/src/screens/appLayout/AppLayoutContext';
import AssetCard from '@homzhub/web/src/screens/portfolio/components/PortfolioCardGroup';
import PortfolioFilter from '@homzhub/web/src/screens/portfolio/components/PortfolioFilter';
import PortfolioOverview from '@homzhub/web/src/screens/portfolio/components/PortfolioOverview';
import { Asset, DataType } from '@homzhub/common/src/domain/models/Asset';
import { Filters, AssetFilter } from '@homzhub/common/src/domain/models/AssetFilter';
import {
  ClosureReasonType,
  IClosureReasonPayload,
  IListingParam,
} from '@homzhub/common/src/domain/repositories/interfaces';
import {
  IGetPropertiesPayload,
  IGetTenanciesPayload,
  ISetAssetPayload,
  IPortfolioState,
} from '@homzhub/common/src/modules/portfolio/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

interface IStateProps {
  tenancies: Asset[] | null;
  properties: Asset[] | null;
  isTenanciesLoading: boolean;
  currentFilter: Filters;
  assetPayload: ISetAssetPayload;
  portfolioLoaders: IPortfolioState['loaders'];
}

export enum UpdatePropertyFormTypes {
  CancelListing = 'CANCEL_LISTING',
  TerminateListing = 'TERMINATE_LISTING',
  RenewListing = 'RENEW_LISTING',
}
interface IDispatchProps {
  getTenanciesDetails: (payload: IGetTenanciesPayload) => void;
  getPropertyDetails: (payload: IGetPropertiesPayload) => void;
  setCurrentAsset: (payload: ISetAssetPayload) => void;
  setEditPropertyFlow: (payload: boolean) => void;
  setAssetId: (payload: number) => void;
}
interface ILocalState {
  filters: AssetFilter;
  assetType: string;
  whilePortfolioFilters: boolean;
  assetDetails: Asset | null;
  formType: string;
  param: IListingParam | null;
  payload: IClosureReasonPayload | null;
  submittedSuccessfully: boolean;
}
interface IAssetCardProps {
  history: History;
}
type Props = WithTranslation & IStateProps & IDispatchProps & IWithMediaQuery & IAssetCardProps;
export class Portfolio extends React.PureComponent<Props, ILocalState> {
  /* eslint-disable react/sort-comp */
  /* eslint-disable react/static-property-placement */
  public static contextType = AppLayoutContext;
  public state = {
    filters: new AssetFilter(),
    assetType: '',
    whilePortfolioFilters: false,
    assetDetails: null,
    formType: '',
    param: null,
    payload: null,
    submittedSuccessfully: false,
  };

  public componentDidMount = (): void => {
    this.getScreenData().then();
  };

  public popupRef = createRef<PopupActions>();
  public render = (): React.ReactElement => {
    const { properties, tenancies, portfolioLoaders, isTablet, isMobile } = this.props;
    const {
      filters,
      whilePortfolioFilters,
      assetDetails,
      formType,
      param,
      payload,
      submittedSuccessfully,
    } = this.state;
    const { tenancies: tenanciesLoader, properties: propertiesLoader } = portfolioLoaders;
    const isLoading = whilePortfolioFilters || tenanciesLoader || propertiesLoader;
    const { context } = this;
    const { setIsMenuLoading } = context;
    setIsMenuLoading(isLoading);
    if (isLoading) {
      return <Loader visible={isLoading} />;
    }
    const onClosePopover = (): void => {
      if (this.popupRef && this.popupRef.current) {
        this.popupRef.current.close();
      }
    };

    const submitSuccess = (): void => {
      this.setState({ submittedSuccessfully: true });
    };

    const updateData = (): void => {
      this.getScreenData().then();
    };
    return (
      <View style={[styles.filterContainer, !isTablet && styles.filterContainerWeb]}>
        <PortfolioOverview onMetricsClicked={this.onMetricsClicked} />
        <PortfolioFilter filterData={filters} getStatus={this.getStatus} />
        {tenancies && tenancies.length > 0 && this.renderTenancies(tenancies)}
        {this.renderPortfolio(properties)}
        <Popover
          content={
            !submittedSuccessfully ? (
              <CancelTerminateListing
                assetDetails={assetDetails}
                formType={formType}
                param={param}
                payload={payload}
                closeModal={onClosePopover}
                submit={submitSuccess}
              />
            ) : (
              <ConfirmationContent closeModal={onClosePopover} updateData={updateData} />
            )
          }
          forwardedRef={this.popupRef}
          popupProps={{
            onClose: onClosePopover,
            modal: true,
            arrow: false,
            contentStyle: {
              width: !isMobile ? (!submittedSuccessfully ? 385 : 480) : '95%',
              overflowY: 'scroll',
              height: !isMobile ? (!submittedSuccessfully ? 569 : undefined) : undefined,
            },
            closeOnDocumentClick: false,
            children: undefined,
          }}
        />
      </View>
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
      <View>
        <Text type="small" textType="semiBold" style={styles.title}>
          {t('tenancies')}
        </Text>
        {(assetType ? filteredData : tenancies).map((tenancy, index) =>
          this.renderList(tenancy, index, DataType.TENANCIES)
        )}
      </View>
    );
  };

  private renderPortfolio = (properties: Asset[] | null): React.ReactElement => {
    const { t, currentFilter } = this.props;
    const { assetType } = this.state;
    const title = currentFilter === Filters.ALL ? t('noPropertiesAdded') : t('noFilterProperties');
    const data = assetType ? (properties ?? []).filter((item) => item.assetGroup.name === assetType) : properties;
    const isEmpty = !data || data.length <= 0;
    return (
      <View style={styles.container}>
        <View style={styles.headingView}>
          <Text type="small" textType="semiBold" style={styles.title}>
            {t('propertyPortfolio')}
          </Text>
        </View>
        {isEmpty ? (
          <EmptyState title={title} icon={icons.home} containerStyle={styles.emptyView} />
        ) : (
          data?.map((property, index) => this.renderList(property, index, DataType.PROPERTIES))
        )}
      </View>
    );
  };

  private renderList = (item: Asset, index: number, type: DataType): React.ReactElement => {
    const { isTablet, history } = this.props;
    const onPressAction = (payload: IClosureReasonPayload, param?: IListingParam): void => {
      this.setState({ assetDetails: item, payload });
      this.handleActions(item, payload, param);
    };
    const handleViewProperty = (data: ISetAssetPayload, key?: Tabs): void => {
      const { setCurrentAsset } = this.props;
      setCurrentAsset(data);
      this.navigateToDetailView({ ...data, dataType: type }, key);
    };
    return (
      <View>
        <AssetCard
          assetData={item}
          key={index}
          isFromTenancies={type === DataType.TENANCIES}
          onViewProperty={handleViewProperty}
          onPressArrow={FunctionUtils.noop}
          onCompleteDetails={this.onCompleteDetails}
          onOfferVisitPress={FunctionUtils.noop}
          onHandleAction={onPressAction}
          containerStyle={isTablet && styles.assetCardContainer}
          history={history}
        />
      </View>
    );
  };

  private onMetricsClicked = (name: string): void => {
    const { assetType } = this.state;
    if (assetType === name) {
      name = '';
    }
    this.setState({ assetType: name });
  };

  private onPropertiesCallback = (): void => {};
  private onCompleteDetails = (assetId: number): void => {
    const { setAssetId, setEditPropertyFlow, history } = this.props;
    setAssetId(assetId);
    setEditPropertyFlow(true);
    NavigationUtils.navigate(history, {
      path: RouteNames.protectedRoutes.PROPERTY_VIEW,
      params: {
        previousScreen: 'Dashboard',
      },
    });
  };

  private handleActions = (asset: Asset, payload: IClosureReasonPayload, param?: IListingParam): void => {
    const { setAssetId, history } = this.props;
    const { id } = asset;
    setAssetId(id);
    const { CancelListing, TerminateListing } = UpdatePropertyFormTypes;
    const { LEASE_TRANSACTION_TERMINATION } = ClosureReasonType;
    const formType = payload.type === LEASE_TRANSACTION_TERMINATION ? TerminateListing : CancelListing;
    this.setState({ formType, param: param || {} });
    const onNavigateToPlanSelection = (): void => {
      NavigationUtils.navigate(history, { path: RouteNames.protectedRoutes.ADD_LISTING });
    };
    if (param && param.hasTakeAction) {
      onNavigateToPlanSelection();
    } else if (formType === CancelListing) {
      if (this.popupRef && this.popupRef.current) {
        this.popupRef.current.open();
      }
    }
    // TODO: handle terminate
  };

  private navigateToDetailView = (data: ISetAssetPayload, key?: Tabs): void => {
    const { history, setCurrentAsset } = this.props;
    setCurrentAsset(data);
    const { asset_id, assetType, listing_id } = data;
    NavigationUtils.navigate(history, {
      path: RouteNames.protectedRoutes.PROPERTY_SELECTED,
      params: {
        isFromTenancies: data.dataType === DataType.TENANCIES,
        ...(key && { tabKey: key }),
        asset_id,
        assetType,
        listing_id,
      },
    });
  };

  private getStatus = (filter: string): void => {
    const { getPropertyDetails } = this.props;
    getPropertyDetails({ status: filter, onCallback: this.onPropertiesCallback });
  };

  private getScreenData = async (): Promise<void> => {
    await this.getAssetFilters();
    this.getTenancies();
    this.getPortfolioProperty();
  };

  private getTenancies = (): void => {
    const { getTenanciesDetails } = this.props;
    getTenanciesDetails({ onCallback: this.onPropertiesCallback });
  };

  private getPortfolioProperty = (): void => {
    const { getPropertyDetails, currentFilter } = this.props;
    getPropertyDetails({ status: currentFilter, onCallback: this.onPropertiesCallback });
  };

  private getAssetFilters = async (): Promise<void> => {
    try {
      this.setState({
        whilePortfolioFilters: true,
      });
      const response: AssetFilter = await PortfolioRepository.getAssetFilters();
      this.setState({ filters: response, whilePortfolioFilters: false });
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      this.setState({
        whilePortfolioFilters: false,
      });
      AlertHelper.error({ message: error, statusCode: e.details.statusCode });
    }
  };
}
const mapStateToProps = (state: IState): IStateProps => {
  return {
    tenancies: PortfolioSelectors.getTenancies(state),
    properties: PortfolioSelectors.getProperties(state),
    currentFilter: PortfolioSelectors.getCurrentFilter(state),
    isTenanciesLoading: PortfolioSelectors.getTenanciesLoadingState(state),
    assetPayload: PortfolioSelectors.getCurrentAssetPayload(state),
    portfolioLoaders: PortfolioSelectors.getPortfolioLoaders(state),
  };
};
const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getPropertyDetails, setCurrentAsset, getTenanciesDetails } = PortfolioActions;
  const { setAssetId, setEditPropertyFlow } = RecordAssetActions;
  return bindActionCreators(
    {
      getTenanciesDetails,
      getPropertyDetails,
      setCurrentAsset,
      setAssetId,
      setEditPropertyFlow,
    },
    dispatch
  );
};

const translatedPortfolio = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(Portfolio));
export default withMediaQuery<any>(translatedPortfolio);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    maxWidth: '100%',
  },
  assetCardContainer: {
    flexDirection: 'column',
    maxWidth: '100%',
  },
  title: {
    color: theme.colors.darkTint1,
    marginBottom: 16,
    marginTop: 4,
  },
  headingView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyView: {
    minHeight: 200,
  },
  filterContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  filterContainerWeb: {
    width: '93%',
  },
});
