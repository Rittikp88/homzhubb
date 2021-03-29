import React from 'react';
import { PickerItemProps, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { History } from 'history';
import { IWithMediaQuery, withMediaQuery } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationUtils } from 'utils/NavigationUtils';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import AssetCard from '@homzhub/web/src/screens/portfolio/components/PortfolioCardGroup';
import PortfolioFilter from '@homzhub/web/src/screens/portfolio/components/PortfolioFilter';
import PortfolioOverview from '@homzhub/web/src/screens/portfolio/components/PortfolioOverview';
import { Asset, DataType } from '@homzhub/common/src/domain/models/Asset';
import { Filters, AssetFilter } from '@homzhub/common/src/domain/models/AssetFilter';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';
import {
  IGetPropertiesPayload,
  IGetTenanciesPayload,
  ISetAssetPayload,
} from '@homzhub/common/src/modules/portfolio/interfaces';
import { Tabs } from '@homzhub/common/src/constants/Tabs';

import { IClosureReasonPayload, IListingParam } from '@homzhub/common/src/domain/repositories/interfaces';

interface IStateProps {
  tenancies: Asset[] | null;
  properties: Asset[] | null;
  isTenanciesLoading: boolean;
  currentFilter: Filters;
  assetPayload: ISetAssetPayload;
}

interface IPopupData {
  label: string;
  title: string;
}

interface IPopupData {
  label: string;
  title: string;
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
interface IPortfolioState {
  filters: PickerItemProps[];
  assetType: string;
}

interface IAssetCardProps {
  history: History;
}
type Props = WithTranslation & IStateProps & IDispatchProps & IWithMediaQuery & IAssetCardProps;

export class Portfolio extends React.PureComponent<Props, IPortfolioState> {
  public state = {
    filters: [],
    assetType: '',
  };

  public componentDidMount = (): void => {
    this.getScreenData().then();
  };

  public render = (): React.ReactElement => {
    const { properties, tenancies } = this.props;
    const { filters } = this.state;

    return (
      <View style={styles.filterContainer}>
        <PortfolioOverview onMetricsClicked={this.onMetricsClicked} />
        <PortfolioFilter filterData={filters} getStatus={this.getStatus} />
        {tenancies && tenancies.length > 0 && this.renderTenancies(tenancies)}
        {this.renderPortfolio(properties)}
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
      this.handleActions(item, payload, param);
    };
    const handleViewProperty = (data: ISetAssetPayload, key?: Tabs): void => {
      const { setCurrentAsset } = this.props;

      setCurrentAsset(data);

      this.navigateToDetailView({ ...data, dataType: type }, key);
    };
    return (
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
    const onNavigateToPlanSelection = (): void => {
      NavigationUtils.navigate(history, { path: RouteNames.protectedRoutes.ADD_LISTING });
    };
    if (param && param.hasTakeAction) {
      onNavigateToPlanSelection();
    } else {
      // TODO : Handle logic for cancel and terminate once the screens are ready
    }
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
      const response: AssetFilter[] = await PortfolioRepository.getAssetFilters();
      const filterData = response.map(
        (item): IPopupData => {
          return {
            label: item.title,
            title: item.label,
          };
        }
      );
      this.setState({ filters: filterData });
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
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
});
