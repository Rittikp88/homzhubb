import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { EmptyState, Text } from '@homzhub/common/src/components';
import { Loader } from '@homzhub/mobile/src/components';
import PropertyVisitList from '@homzhub/mobile/src/components/organisms/PropertyVisitList';
import { IVisitByKey, VisitActions, VisitStatusType } from '@homzhub/common/src/domain/models/AssetVisit';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import {
  IAssetVisitPayload,
  IUpdateVisitPayload,
  VisitStatus,
} from '@homzhub/common/src/domain/repositories/interfaces';

interface IRoutes {
  key: VisitStatusType;
  title: string;
  color: string;
}

const Routes: IRoutes[] = [
  {
    key: VisitStatusType.UPCOMING,
    title: 'Upcoming',
    color: theme.colors.mediumPriority,
  },
  { key: VisitStatusType.MISSED, title: 'Missed', color: theme.colors.error },
  { key: VisitStatusType.COMPLETED, title: 'Completed', color: theme.colors.green },
];

interface IDispatchProps {
  getAssetVisit: (payload: IAssetVisitPayload) => void;
  setVisitIds: (payload: number[]) => void;
}

interface IStateProps {
  visits: IVisitByKey[];
  asset: Asset | null;
  isLoading: boolean;
}

interface IProps {
  isFromProperty?: boolean;
  onReschedule: (isNew?: boolean) => void;
  selectedAssetId?: number;
  navigation?: any;
  setVisitPayload?: (payload: IAssetVisitPayload) => void;
}

interface IScreenState {
  currentIndex: number;
}

type Props = IDispatchProps & IStateProps & IProps;

class SiteVisitTab extends Component<Props, IScreenState> {
  public _unsubscribe: any;
  public state = {
    currentIndex: 0,
  };

  public componentDidMount(): void {
    const { navigation } = this.props;
    if (navigation) {
      this._unsubscribe = navigation.addListener('focus', () => {
        this.getVisitsData();
      });
    }
  }

  public componentWillUnmount(): void {
    const { navigation } = this.props;
    if (navigation) {
      this._unsubscribe();
    }
  }

  public render(): React.ReactNode {
    const { currentIndex } = this.state;
    return (
      <>
        <TabView
          lazy
          renderLazyPlaceholder={(): React.ReactElement => <Loader visible />}
          initialLayout={theme.viewport}
          renderScene={this.renderScene}
          onIndexChange={this.handleIndexChange}
          renderTabBar={(props): React.ReactElement => {
            const {
              navigationState: { index, routes },
            } = props;
            const currentRoute = routes[index];
            return (
              <TabBar
                {...props}
                style={styles.tabBar}
                indicatorStyle={{ backgroundColor: currentRoute.color }}
                renderLabel={({ route }): React.ReactElement => {
                  return (
                    <Text type="small" style={styles.tabLabel}>
                      {route.title}
                    </Text>
                  );
                }}
              />
            );
          }}
          swipeEnabled={false}
          navigationState={{
            index: currentIndex,
            routes: Routes,
          }}
        />
      </>
    );
  }

  private renderScene = ({ route }: { route: IRoutes }): React.ReactElement | null => {
    const { visits, isLoading, isFromProperty } = this.props;

    switch (route.key) {
      case VisitStatusType.UPCOMING:
        return (
          <PropertyVisitList
            visitType={VisitStatusType.UPCOMING}
            visitData={visits}
            isFromProperty={isFromProperty}
            isLoading={isLoading}
            handleAction={this.handleVisitActions}
            handleReschedule={(id): void => this.handleRescheduleVisit(id, VisitStatusType.UPCOMING)}
            handleDropdown={this.onDropdownValueSelect}
          />
        );
      case VisitStatusType.MISSED:
        return (
          <PropertyVisitList
            visitType={VisitStatusType.MISSED}
            visitData={visits}
            isLoading={isLoading}
            isFromProperty={isFromProperty}
            handleAction={this.handleVisitActions}
            handleReschedule={(id): void => this.handleRescheduleVisit(id, VisitStatusType.MISSED)}
            handleDropdown={this.onDropdownValueSelect}
          />
        );
      case VisitStatusType.COMPLETED:
        return (
          <PropertyVisitList
            visitType={VisitStatusType.COMPLETED}
            visitData={visits}
            isLoading={isLoading}
            isFromProperty={isFromProperty}
            handleAction={this.handleVisitActions}
            handleReschedule={(id): void => this.handleRescheduleVisit(id, VisitStatusType.COMPLETED)}
            handleDropdown={this.onDropdownValueSelect}
          />
        );
      default:
        return <EmptyState />;
    }
  };

  private onDropdownValueSelect = (startDate: string, endDate: string, visitType: VisitStatusType): void => {
    const { getAssetVisit } = this.props;
    let status;
    let start_date__lte = endDate;
    const start_date__gte = startDate;

    switch (visitType) {
      case VisitStatusType.MISSED:
        start_date__lte = DateUtils.getCurrentDateISO();
        status = VisitStatus.PENDING;
        break;
      case VisitStatusType.COMPLETED:
        status = VisitStatus.ACCEPTED;
        start_date__lte = DateUtils.getCurrentDateISO();
        break;
      default:
    }

    const payload: IAssetVisitPayload = {
      start_date__lte,
      start_date__gte,
      ...(status && { status }),
    };

    getAssetVisit(payload);
  };

  private handleRescheduleVisit = (id: number, key: VisitStatusType): void => {
    const { onReschedule, setVisitIds } = this.props;
    setVisitIds([id]);
    if (key === VisitStatusType.COMPLETED) {
      onReschedule(true);
    } else {
      onReschedule(false);
    }
  };

  private handleIndexChange = (index: number): void => {
    this.setState({ currentIndex: index }, () => this.getVisitsData());
  };

  private handleVisitActions = async (id: number, action: VisitActions): Promise<void> => {
    const payload: IUpdateVisitPayload = {
      id,
      data: {
        status: action,
      },
    };
    try {
      await AssetRepository.updatePropertyVisit(payload);
      this.getVisitsData();
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private getVisitsData = (): void => {
    const { getAssetVisit, asset, isFromProperty = false, selectedAssetId, setVisitPayload } = this.props;
    const { currentIndex } = this.state;
    const currentRoute = Routes[currentIndex];
    const date = DateUtils.getCurrentDateISO();
    let start_date_lte;
    let start_date_gte;
    let lease_listing_id;
    let sale_listing_id;
    let status;
    switch (currentRoute.key) {
      case VisitStatusType.UPCOMING:
        start_date_gte = date;
        break;
      case VisitStatusType.MISSED:
        start_date_lte = date;
        status = VisitStatus.PENDING;
        break;
      case VisitStatusType.COMPLETED:
        status = VisitStatus.ACCEPTED;
        start_date_lte = date;
        break;
      default:
    }
    if (setVisitPayload) {
      setVisitPayload({
        ...(start_date_lte && { start_date__lte: start_date_lte }),
        ...(start_date_gte && { start_date__gte: start_date_gte }),
        ...(status && { status }),
      });
    }

    if (isFromProperty && asset && asset.assetStatusInfo) {
      if (!asset.assetStatusInfo.saleListingId && !asset.assetStatusInfo.leaseListingId) {
        return;
      }
      if (asset.assetStatusInfo.leaseListingId) {
        lease_listing_id = asset.assetStatusInfo.leaseListingId;
      } else {
        sale_listing_id = asset.assetStatusInfo.saleListingId;
      }
    }

    const payload: IAssetVisitPayload = {
      ...(start_date_lte && { start_date__lte: start_date_lte }),
      ...(start_date_gte && { start_date__gte: start_date_gte }),
      ...(isFromProperty && lease_listing_id && { lease_listing_id }),
      ...(isFromProperty && sale_listing_id && { sale_listing_id }),
      ...(selectedAssetId !== 0 && { asset_id: selectedAssetId }),
      ...(status && { status }),
    };

    getAssetVisit(payload);
  };
}

export const mapStateToProps = (state: IState): IStateProps => {
  return {
    visits: AssetSelectors.getAssetVisitsByDate(state),
    isLoading: AssetSelectors.getVisitLoadingState(state),
    asset: PortfolioSelectors.getAssetById(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetVisit, setVisitIds } = AssetActions;
  return bindActionCreators(
    {
      getAssetVisit,
      setVisitIds,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SiteVisitTab);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.white,
    marginTop: 10,
  },
  tabLabel: {
    color: theme.colors.darkTint3,
  },
});
