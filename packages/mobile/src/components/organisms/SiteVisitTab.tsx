import React, { PureComponent } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { WithTranslation, withTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import EventWithProfile from '@homzhub/mobile/src/components/molecules/EventWithProfile';
import PropertyVisitList from '@homzhub/mobile/src/components/organisms/PropertyVisitList';
import { Pillar, PillarTypes } from '@homzhub/common/src/domain/models/Pillar';
import { IVisitByKey, VisitActions } from '@homzhub/common/src/domain/models/AssetVisit';
import { IState } from '@homzhub/common/src/modules/interfaces';
import {
  DetailType,
  IAssetVisitPayload,
  IUpdateVisitPayload,
  VisitStatus,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { MoreStackNavigatorParamList, PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IDropdownObject } from '@homzhub/common/src/constants/FinanceOverview';
import { MISSED_COMPLETED_DATA, UPCOMING_DROPDOWN_DATA } from '@homzhub/common/src/constants/SiteVisit';
import { IRoutes, Tabs, VisitRoutes } from '@homzhub/common/src/constants/Tabs';
import { UserInteraction } from '@homzhub/common/src/domain/models/UserInteraction';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';

const { height } = theme.viewport;

interface IDispatchProps {
  getAssetVisit: (payload: IAssetVisitPayload) => void;
  setVisitIds: (payload: number[]) => void;
  setVisitType: (payload: Tabs) => void;
}

interface IStateProps {
  visits: IVisitByKey[];
  asset: ISetAssetPayload;
  isLoading: boolean;
}

type NavigationType =
  | StackNavigationProp<MoreStackNavigatorParamList, ScreensKeys.PropertyVisits>
  | StackNavigationProp<PortfolioNavigatorParamList, ScreensKeys.PropertyDetailScreen>;

interface IProps {
  isFromProperty?: boolean;
  isFromTenancies?: boolean;
  onReschedule: (isNew?: boolean, userId?: number) => void;
  selectedAssetId?: number;
  isViewChanged?: boolean;
  navigation?: NavigationType;
  setVisitPayload?: (payload: IAssetVisitPayload) => void;
  visitId?: number | null;
  reviewVisitId?: number;
}

interface IScreenState {
  currentIndex: number;
  dropdownValue: number;
  heights: number[];
  isFromNav: boolean;
  userDetail: UserInteraction;
  isProfileVisible: boolean;
  pillars: Pillar[];
}

type Props = IDispatchProps & IStateProps & IProps & WithTranslation;

class SiteVisitTab extends PureComponent<Props, IScreenState> {
  public _unsubscribe: any;

  public constructor(props: Props) {
    super(props);
    this.state = {
      currentIndex: props.reviewVisitId ? 2 : 0,
      dropdownValue: 1,
      heights: [height, height, height],
      isFromNav: true,
      userDetail: {} as UserInteraction,
      isProfileVisible: false,
      pillars: [],
    };
  }

  public componentDidMount(): void {
    const { navigation, reviewVisitId } = this.props;
    this.getRatingPillars().then();

    if (navigation) {
      // @ts-ignore
      this._unsubscribe = navigation.addListener('focus', () => {
        this.getVisitsData();
      });
    }

    if (reviewVisitId) {
      this.setState({ currentIndex: 2 }, this.getVisitsData);
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
    const { currentIndex, heights, userDetail, isProfileVisible } = this.state;
    const { t } = this.props;
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
                    <Text type="small" style={styles.tabLabel} numberOfLines={1}>
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
            routes: VisitRoutes,
          }}
        />
        {!isEmpty(userDetail) && (
          <BottomSheet
            visible={isProfileVisible}
            onCloseSheet={this.onCloseProfile}
            headerTitle={t('assetMore:profile')}
            isShadowView
            sheetHeight={600}
          >
            <EventWithProfile
              detail={userDetail}
              handleVisitAction={this.handleVisitActions}
              handleConfirmation={this.showConfirmation}
              handleReschedule={this.handleSchedule}
            />
          </BottomSheet>
        )}
      </>
    );
  }

  private renderScene = ({ route }: { route: IRoutes }): React.ReactElement | null => {
    const { visits, isLoading, reviewVisitId } = this.props;
    const { dropdownValue, pillars } = this.state;
    let dropdownData;

    switch (route.key) {
      case Tabs.UPCOMING:
        dropdownData = this.getDropdownData(Tabs.UPCOMING);
        return (
          <View onLayout={(e): void => this.onLayout(e, 0)}>
            <PropertyVisitList
              visitType={route.key}
              visitData={visits}
              dropdownData={dropdownData}
              dropdownValue={dropdownValue}
              isLoading={isLoading}
              handleAction={this.handleVisitActions}
              handleReschedule={(id): void => this.handleRescheduleVisit(id, Tabs.UPCOMING)}
              handleDropdown={this.handleDropdownSelection}
              handleUserView={this.onShowProfile}
            />
          </View>
        );
      case Tabs.MISSED:
        dropdownData = this.getDropdownData(Tabs.MISSED);
        return (
          <View onLayout={(e): void => this.onLayout(e, 1)}>
            <PropertyVisitList
              visitType={route.key}
              visitData={visits}
              isLoading={isLoading}
              dropdownValue={dropdownValue}
              dropdownData={dropdownData}
              handleAction={this.handleVisitActions}
              handleReschedule={(id): void => this.handleRescheduleVisit(id, Tabs.MISSED)}
              handleDropdown={this.handleDropdownSelection}
              handleUserView={this.onShowProfile}
            />
          </View>
        );
      case Tabs.COMPLETED:
        dropdownData = this.getDropdownData(Tabs.COMPLETED);
        return (
          <View onLayout={(e): void => this.onLayout(e, 2)}>
            <PropertyVisitList
              visitType={route.key}
              visitData={visits}
              isLoading={isLoading}
              dropdownValue={dropdownValue}
              dropdownData={dropdownData}
              handleAction={this.handleVisitActions}
              handleReschedule={(id, userId): void => this.handleRescheduleVisit(id, Tabs.COMPLETED, userId)}
              handleDropdown={this.handleDropdownSelection}
              handleUserView={this.onShowProfile}
              pillars={pillars}
              resetData={this.getVisitsData}
              reviewVisitId={reviewVisitId}
            />
          </View>
        );
      default:
        return <EmptyState />;
    }
  };

  private onDropdownValueSelect = (startDate: string, endDate: string, visitType: Tabs): void => {
    const { getAssetVisit, selectedAssetId, setVisitPayload } = this.props;
    let status;
    const start_date__lt = endDate;
    const start_date__gte = startDate;

    switch (visitType) {
      case Tabs.MISSED:
        status = VisitStatus.PENDING;
        break;
      case Tabs.COMPLETED:
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

  private onCloseProfile = (): void => {
    this.setState({
      isProfileVisible: false,
    });
  };

  private onShowProfile = (id: number): void => {
    UserRepository.getUserInteractions(id)
      .then((response) => {
        this.setState({
          isProfileVisible: true,
          userDetail: response,
        });
      })
      .catch((e) => {
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      });
  };

  private handleRescheduleVisit = (id: number, key: Tabs, userId?: number): void => {
    const { onReschedule, setVisitIds } = this.props;
    setVisitIds([id]);
    console.log(key, userId);
    if (key === Tabs.COMPLETED) {
      onReschedule(true, userId);
    } else {
      onReschedule(false);
    }
  };

  private handleIndexChange = (index: number): void => {
    const { setVisitType } = this.props;
    const { key } = VisitRoutes[index];
    setVisitType(key);
    this.setState({ currentIndex: index, dropdownValue: 1 }, this.getVisitsData);
  };

  private handleVisitActions = async (visitId: number, action: VisitActions, isUserView?: boolean): Promise<void> => {
    const payload: IUpdateVisitPayload = {
      id: visitId,
      data: {
        status: action,
      },
    };

    try {
      await AssetRepository.updatePropertyVisit(payload);
      if (isUserView) {
        const {
          userDetail: {
            user: { id },
          },
        } = this.state;
        this.onShowProfile(id);
      } else {
        this.getVisitsData();
      }
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private handleDropdownSelection = (value: string | number, visitType: Tabs): void => {
    const currentDate = DateUtils.getCurrentDateISO();
    this.setState({
      dropdownValue: value as number,
    });
    const data = this.getDropdownData(visitType);
    const selectedData = data.find((item) => item.value === (value as number));
    if (selectedData) {
      const fromDate =
        visitType === Tabs.UPCOMING && selectedData.startDate < currentDate ? currentDate : selectedData.startDate;
      this.onDropdownValueSelect(fromDate, selectedData.endDate, visitType);
    }
  };

  private handleSchedule = (id: number): void => {
    const { onReschedule, setVisitIds, getAssetVisit } = this.props;
    setVisitIds([id]);
    getAssetVisit({ id });
    onReschedule(false);
    this.onCloseProfile();
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

  private showConfirmation = (visitId: number): void => {
    const { t } = this.props;
    AlertHelper.alert({
      title: t('property:cancelVisit'),
      message: t('property:wantCancelVisit'),
      onOkay: () => this.handleVisitActions(visitId, VisitActions.CANCEL, true).then(),
    });
  };

  private getDropdownData = (visitType: Tabs): IDropdownObject[] => {
    const { t } = this.props;
    let results;
    switch (visitType) {
      case Tabs.UPCOMING:
        results = Object.values(UPCOMING_DROPDOWN_DATA);
        break;
      case Tabs.MISSED:
      case Tabs.COMPLETED:
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
    const {
      getAssetVisit,
      asset,
      isFromProperty = false,
      selectedAssetId,
      setVisitPayload,
      visitId,
      isFromTenancies,
    } = this.props;
    const { currentIndex, dropdownValue, isFromNav } = this.state;
    const currentRoute = VisitRoutes[currentIndex];
    const date = DateUtils.getDisplayDate(new Date().toISOString(), DateFormats.ISO24Format);
    let dropdownData: IDropdownObject[] = [];
    let key = '';

    let start_date_lte;
    let start_date_gte;
    let lease_listing_id;
    let sale_listing_id;
    let start_date_lt;
    let status;

    if (isFromTenancies) {
      return;
    }

    switch (currentRoute.key) {
      case Tabs.UPCOMING:
        dropdownData = this.getDropdownData(Tabs.UPCOMING);
        key = Tabs.UPCOMING;
        start_date_gte = date;
        status = `${VisitStatus.ACCEPTED},${VisitStatus.PENDING}`;
        break;
      case Tabs.MISSED:
        dropdownData = this.getDropdownData(Tabs.MISSED);
        key = Tabs.MISSED;
        start_date_gte = date;
        status = `${VisitStatus.REJECTED},${VisitStatus.CANCELLED},${VisitStatus.PENDING}`;
        break;
      case Tabs.COMPLETED:
        dropdownData = this.getDropdownData(Tabs.COMPLETED);
        key = Tabs.COMPLETED;
        start_date_lte = date;
        status = `${VisitStatus.ACCEPTED}`;
        break;
      default:
    }

    const selectedData = dropdownData.find((item) => item.value === dropdownValue);

    if (selectedData) {
      start_date_gte =
        key === (Tabs.UPCOMING || Tabs.MISSED) && selectedData.startDate < date ? date : selectedData.startDate;
      start_date_lt = selectedData.endDate;
    }

    if (setVisitPayload) {
      setVisitPayload({
        ...(start_date_lte && { start_date__lte: start_date_lte }),
        ...(start_date_gte && { start_date__gte: start_date_gte }),
        ...(start_date_lt && { start_date__lt: start_date_lt }),
        ...(status && { status__in: status }),
      });
    }

    if (isFromProperty && asset && asset.assetType) {
      const isLease = asset.assetType === DetailType.LEASE_UNIT || asset.assetType === DetailType.LEASE_LISTING;
      if (isLease) {
        lease_listing_id = asset.lease_listing_id;
      } else {
        sale_listing_id = asset.sale_listing_id;
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
        ...(key !== Tabs.MISSED && start_date_lt && { start_date__lt: start_date_lt }),
        ...(start_date_gte && { start_date__gte: start_date_gte }),
        ...(isFromProperty && lease_listing_id && { lease_listing_id }),
        ...(isFromProperty && sale_listing_id && { sale_listing_id }),
        ...(selectedAssetId && selectedAssetId !== 0 && { asset_id: selectedAssetId }),
        ...(status && { status__in: status }),
      };
    }

    getAssetVisit(payload);
  };

  private getRatingPillars = async (): Promise<void> => {
    try {
      const pillars = await CommonRepository.getPillars(PillarTypes.LISTING_REVIEW);
      this.setState({ pillars });
      // eslint-disable-next-line no-empty
    } catch (err) {}
  };
}

export const mapStateToProps = (state: IState): IStateProps => {
  return {
    visits: AssetSelectors.getAssetVisitsByDate(state),
    isLoading: AssetSelectors.getVisitLoadingState(state),
    asset: PortfolioSelectors.getCurrentAssetPayload(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getAssetVisit, setVisitIds, setVisitType } = AssetActions;
  return bindActionCreators(
    {
      getAssetVisit,
      setVisitIds,
      setVisitType,
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
