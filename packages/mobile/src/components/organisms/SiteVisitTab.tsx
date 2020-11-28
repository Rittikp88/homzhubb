import React, { Component } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { bindActionCreators, Dispatch } from 'redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import PropertyVisitList from '@homzhub/mobile/src/components/organisms/PropertyVisitList';
import { IVisitByKey, VisitActions, VisitStatusType } from '@homzhub/common/src/domain/models/AssetVisit';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import {
  IAssetVisitPayload,
  IUpdateVisitPayload,
  VisitStatus,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { MoreStackNavigatorParamList, PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IDropdownObject } from '@homzhub/common/src/constants/FinanceOverview';
import { MISSED_COMPLETED_DATA, UPCOMING_DROPDOWN_DATA } from '@homzhub/common/src/constants/SiteVisit';

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

const { height } = theme.viewport;

interface IDispatchProps {
  getAssetVisit: (payload: IAssetVisitPayload) => void;
  setVisitIds: (payload: number[]) => void;
}

interface IStateProps {
  visits: IVisitByKey[];
  asset: Asset | null;
  isLoading: boolean;
}

type NavigationType =
  | StackNavigationProp<MoreStackNavigatorParamList, ScreensKeys.PropertyVisits>
  | StackNavigationProp<PortfolioNavigatorParamList, ScreensKeys.PropertyDetailScreen>;

interface IProps {
  isFromProperty?: boolean;
  onReschedule: (isNew?: boolean) => void;
  selectedAssetId?: number;
  isViewChanged?: boolean;
  navigation?: NavigationType;
  setVisitPayload?: (payload: IAssetVisitPayload) => void;
  visitId?: number | null;
}

interface IScreenState {
  currentIndex: number;
  dropdownValue: number;
  heights: number[];
  isFromNav: boolean;
}

type Props = IDispatchProps & IStateProps & IProps & WithTranslation;

class SiteVisitTab extends Component<Props, IScreenState> {
  public _unsubscribe: any;
  public state = {
    currentIndex: 0,
    dropdownValue: 1,
    heights: [height, height, height],
    isFromNav: true,
  };

  public componentDidMount(): void {
    const { navigation } = this.props;
    if (navigation) {
      // @ts-ignore
      this._unsubscribe = navigation.addListener('focus', () => {
        this.getVisitsData();
      });
    }
    this.getVisitsData();
  }

  public componentWillUnmount(): void {
    const { navigation } = this.props;
    if (navigation) {
      this._unsubscribe();
    }
  }

  public render(): React.ReactNode {
    const { currentIndex, heights } = this.state;
    const statusIndex = this.getVisitStatus();
    return (
      <>
        <TabView
          initialLayout={theme.viewport}
          style={[styles.tabView, { minHeight: heights[currentIndex] }]}
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
            index: statusIndex || currentIndex,
            routes: Routes,
          }}
        />
      </>
    );
  }

  private renderScene = ({ route }: { route: IRoutes }): React.ReactElement | null => {
    const { visits, isLoading, isFromProperty } = this.props;
    const { dropdownValue } = this.state;
    let dropdownData;

    switch (route.key) {
      case VisitStatusType.UPCOMING:
        dropdownData = this.getDropdownData(VisitStatusType.UPCOMING);
        return (
          <View onLayout={(e): void => this.onLayout(e, 0)}>
            <PropertyVisitList
              visitType={VisitStatusType.UPCOMING}
              visitData={visits}
              dropdownData={dropdownData}
              dropdownValue={dropdownValue}
              isFromProperty={isFromProperty}
              isLoading={isLoading}
              handleAction={this.handleVisitActions}
              handleReschedule={(id): void => this.handleRescheduleVisit(id, VisitStatusType.UPCOMING)}
              handleDropdown={this.handleDropdownSelection}
            />
          </View>
        );
      case VisitStatusType.MISSED:
        dropdownData = this.getDropdownData(VisitStatusType.MISSED);
        return (
          <View onLayout={(e): void => this.onLayout(e, 1)}>
            <PropertyVisitList
              visitType={VisitStatusType.MISSED}
              visitData={visits}
              isLoading={isLoading}
              dropdownValue={dropdownValue}
              dropdownData={dropdownData}
              isFromProperty={isFromProperty}
              handleAction={this.handleVisitActions}
              handleReschedule={(id): void => this.handleRescheduleVisit(id, VisitStatusType.MISSED)}
              handleDropdown={this.handleDropdownSelection}
            />
          </View>
        );
      case VisitStatusType.COMPLETED:
        dropdownData = this.getDropdownData(VisitStatusType.COMPLETED);
        return (
          <View onLayout={(e): void => this.onLayout(e, 2)}>
            <PropertyVisitList
              visitType={VisitStatusType.COMPLETED}
              visitData={visits}
              isLoading={isLoading}
              dropdownValue={dropdownValue}
              dropdownData={dropdownData}
              isFromProperty={isFromProperty}
              handleAction={this.handleVisitActions}
              handleReschedule={(id): void => this.handleRescheduleVisit(id, VisitStatusType.COMPLETED)}
              handleDropdown={this.handleDropdownSelection}
            />
          </View>
        );
      default:
        return <EmptyState />;
    }
  };

  private onDropdownValueSelect = (startDate: string, endDate: string, visitType: VisitStatusType): void => {
    const { getAssetVisit, selectedAssetId, setVisitPayload } = this.props;
    let status;
    const start_date__lt = endDate;
    const start_date__gte = startDate;

    switch (visitType) {
      case VisitStatusType.MISSED:
        status = VisitStatus.PENDING;
        break;
      case VisitStatusType.COMPLETED:
        status = VisitStatus.ACCEPTED;
        break;
      default:
    }

    if (setVisitPayload) {
      setVisitPayload({
        ...(start_date__gte && { start_date__gte }),
        ...(start_date__lt && { start_date__lt }),
        ...(status && { status }),
      });
    }

    const payload: IAssetVisitPayload = {
      start_date__lt,
      start_date__gte,
      ...(status && { status }),
      ...(selectedAssetId !== 0 && { asset_id: selectedAssetId }),
    };

    getAssetVisit(payload);
  };

  private onLayout = (e: LayoutChangeEvent, index: number): void => {
    const { heights } = this.state;
    const { height: newHeight } = e.nativeEvent.layout;
    const arrayToUpdate = [...heights];

    if (newHeight !== arrayToUpdate[index]) {
      arrayToUpdate[index] = newHeight;
      this.setState({ heights: arrayToUpdate });
    }
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

  private handleDropdownSelection = (value: string | number, visitType: VisitStatusType): void => {
    const currentDate = DateUtils.getCurrentDateISO();
    this.setState({
      dropdownValue: value as number,
    });
    const data = this.getDropdownData(visitType);
    const selectedData = data.find((item) => item.value === (value as number));
    if (selectedData) {
      const fromDate =
        visitType === VisitStatusType.UPCOMING && selectedData.startDate < currentDate
          ? currentDate
          : selectedData.startDate;
      this.onDropdownValueSelect(fromDate, selectedData.endDate, visitType);
    }
  };

  private getVisitStatus = (): number | null => {
    const { visits } = this.props;

    if (visits.length === 1) {
      // @ts-ignore
      const { startDate, status } = visits[0].results[0];
      const formattedDate = DateUtils.getDisplayDate(startDate, DateFormats.ISO24Format);
      const currentDate = DateUtils.getDisplayDate(new Date().toISOString(), DateFormats.ISO24Format);
      const dateDiff = DateUtils.getDateDiff(formattedDate, currentDate);
      if (dateDiff > 0) {
        return 0; // UPCOMING
      }
      if (dateDiff < 0 && status === VisitStatus.PENDING) {
        return 1; // MISSED
      }
      return 2; // COMPLETED
    }
    return null;
  };

  private getDropdownData = (visitType: VisitStatusType): IDropdownObject[] => {
    const { t } = this.props;
    let results;
    switch (visitType) {
      case VisitStatusType.UPCOMING:
        results = Object.values(UPCOMING_DROPDOWN_DATA);
        break;
      case VisitStatusType.MISSED:
      case VisitStatusType.COMPLETED:
        results = Object.values(MISSED_COMPLETED_DATA);
        break;
      default:
        results = Object.values(MISSED_COMPLETED_DATA);
    }

    return results.map((currentData: IDropdownObject) => {
      return {
        ...currentData,
        label: t(currentData.label),
      };
    });
  };

  private getVisitsData = (): void => {
    const { getAssetVisit, asset, isFromProperty = false, selectedAssetId, setVisitPayload, visitId } = this.props;
    const { currentIndex, dropdownValue, isFromNav } = this.state;
    const currentRoute = Routes[currentIndex];
    const date = DateUtils.getDisplayDate(new Date().toISOString(), DateFormats.ISO24Format);
    let dropdownData: IDropdownObject[] = [];
    let key = '';

    let start_date_lte;
    let start_date_gte;
    let lease_listing_id;
    let sale_listing_id;
    let start_date_lt;
    let status;
    let status__neq;
    switch (currentRoute.key) {
      case VisitStatusType.UPCOMING:
        dropdownData = this.getDropdownData(VisitStatusType.UPCOMING);
        key = VisitStatusType.UPCOMING;
        start_date_gte = date;
        break;
      case VisitStatusType.MISSED:
        dropdownData = this.getDropdownData(VisitStatusType.UPCOMING);
        key = VisitStatusType.MISSED;
        start_date_lte = date;
        status = VisitStatus.PENDING;
        break;
      case VisitStatusType.COMPLETED:
        dropdownData = this.getDropdownData(VisitStatusType.UPCOMING);
        key = VisitStatusType.COMPLETED;
        status__neq = VisitStatus.PENDING;
        start_date_lte = date;
        break;
      default:
    }

    const selectedData = dropdownData.find((item) => item.value === dropdownValue);

    if (selectedData) {
      start_date_gte =
        key === (VisitStatusType.UPCOMING || VisitStatusType.MISSED) && selectedData.startDate < date
          ? date
          : selectedData.startDate;
      start_date_lt = selectedData.endDate;
    }

    if (setVisitPayload) {
      setVisitPayload({
        ...(start_date_lte && { start_date__lte: start_date_lte }),
        ...(start_date_gte && { start_date__gte: start_date_gte }),
        ...(start_date_lt && { start_date__lt: start_date_lt }),
        ...(status && { status }),
        ...(status__neq && { status__neq }),
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
    let payload: IAssetVisitPayload;
    if (isFromNav && visitId) {
      payload = {
        id: visitId,
      };
      this.setState({ isFromNav: false });
    } else {
      payload = {
        ...(start_date_lte && { start_date__lte: start_date_lte }),
        ...(start_date_lt && { start_date__lt: start_date_lt }),
        ...(start_date_gte && { start_date__gte: start_date_gte }),
        ...(isFromProperty && lease_listing_id && { lease_listing_id }),
        ...(isFromProperty && sale_listing_id && { sale_listing_id }),
        ...(selectedAssetId && selectedAssetId !== 0 && { asset_id: selectedAssetId }),
        ...(status && { status }),
        ...(status__neq && { status__neq }),
      };
    }

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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SiteVisitTab));

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.white,
    marginTop: 10,
  },
  tabLabel: {
    color: theme.colors.darkTint3,
  },
  tabView: {
    flex: 0,
    backgroundColor: theme.colors.white,
  },
});
