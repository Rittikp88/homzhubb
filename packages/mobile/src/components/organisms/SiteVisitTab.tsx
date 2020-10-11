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
  onReschedule: () => void;
}

interface IScreenState {
  currentIndex: number;
}

type Props = IDispatchProps & IStateProps & IProps;

class SiteVisitTab extends Component<Props, IScreenState> {
  public state = {
    currentIndex: 0,
  };

  public componentDidMount(): void {
    this.getVisitsData();
  }

  public render(): React.ReactNode {
    const { currentIndex } = this.state;
    return (
      <>
        <TabView
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
    const { visits, isLoading } = this.props;

    switch (route.key) {
      case VisitStatusType.UPCOMING:
        return (
          <PropertyVisitList
            visitType={VisitStatusType.UPCOMING}
            visitData={visits}
            isLoading={isLoading}
            handleAction={this.handleVisitActions}
            handleReschedule={this.handleRescheduleVisit}
            handleDropdown={this.onDropdownValueSelect}
          />
        );
      case VisitStatusType.MISSED:
        return (
          <PropertyVisitList
            visitType={VisitStatusType.MISSED}
            visitData={visits}
            isLoading={isLoading}
            handleAction={this.handleVisitActions}
            handleReschedule={this.handleRescheduleVisit}
            handleDropdown={this.onDropdownValueSelect}
          />
        );
      case VisitStatusType.COMPLETED:
        return (
          <PropertyVisitList
            visitType={VisitStatusType.COMPLETED}
            visitData={visits}
            isLoading={isLoading}
            handleAction={this.handleVisitActions}
            handleReschedule={this.handleRescheduleVisit}
            handleDropdown={this.onDropdownValueSelect}
          />
        );
      default:
        return <EmptyState />;
    }
  };

  private onDropdownValueSelect = (startDate: string, endDate: string): void => {
    const { getAssetVisit } = this.props;

    const payload: IAssetVisitPayload = {
      start_date__lte: endDate,
      start_date__gte: startDate,
    };

    getAssetVisit(payload);
  };

  private handleRescheduleVisit = (id: number): void => {
    const { onReschedule, setVisitIds } = this.props;
    setVisitIds([id]);
    onReschedule();
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
    const { getAssetVisit, asset, isFromProperty = false } = this.props;
    const { currentIndex } = this.state;
    const currentRoute = Routes[currentIndex];
    const date = DateUtils.getCurrentDateISO();
    let start_date_lte;
    let start_date_gte;
    let status;
    switch (currentRoute.key) {
      case VisitStatusType.UPCOMING:
        start_date_gte = date;
        break;
      case VisitStatusType.MISSED:
        start_date_lte = date;
        break;
      case VisitStatusType.COMPLETED:
        status = VisitStatus.APPROVED;
        break;
      default:
    }

    if (isFromProperty && asset && (!asset.leaseTerm || !asset.saleTerm)) {
      return;
    }

    const payload: IAssetVisitPayload = {
      ...(start_date_lte && { start_date__lte: start_date_lte }),
      ...(start_date_gte && { start_date__gte: start_date_gte }),
      ...(asset && asset.leaseTerm && { lease_listing_id: asset.leaseTerm.id }),
      ...(asset && asset.saleTerm && { sale_listing_id: asset.saleTerm.id }),
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
