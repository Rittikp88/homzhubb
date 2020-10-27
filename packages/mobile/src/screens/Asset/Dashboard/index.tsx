import React from 'react';
import { StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { PortfolioActions } from '@homzhub/common/src/modules/portfolio/actions';
import { RecordAssetActions } from '@homzhub/common/src/modules/recordAsset/actions';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import {
  AnimatedProfileHeader,
  AssetMetricsList,
  AssetAdvertisementBanner,
  AssetSummary,
  Loader,
} from '@homzhub/mobile/src/components';
import AssetMarketTrends from '@homzhub/mobile/src/components/molecules/AssetMarketTrends';
import AssetSubscriptionPlan from '@homzhub/mobile/src/components/molecules/AssetSubscriptionPlan';
import FinanceOverview from '@homzhub/mobile/src/components/organisms/FinanceOverview';
import PendingPropertyListCard from '@homzhub/mobile/src/components/organisms/PendingPropertyListCard';
import { Asset, PropertyStatus } from '@homzhub/common/src/domain/models/Asset';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { IActions, ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { DashboardNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';

interface IDispatchProps {
  setCurrentFilter: (payload: Filters) => void;
  setAssetId: (payload: number) => void;
  setSelectedPlan: (payload: ISelectedAssetPlan) => void;
  setAddPropertyFlow: (payload: boolean) => void;
}

type libraryProps = NavigationScreenProps<DashboardNavigatorParamList, ScreensKeys.DashboardLandingScreen>;
type Props = WithTranslation & libraryProps & IDispatchProps;

interface IDashboardState {
  metrics: AssetMetrics;
  pendingProperties: Asset[];
  isLoading: boolean;
}

export class Dashboard extends React.PureComponent<Props, IDashboardState> {
  public focusListener: any;

  public state = {
    metrics: {} as AssetMetrics,
    pendingProperties: [],
    isLoading: false,
  };

  public componentDidMount = (): void => {
    const { navigation, setAddPropertyFlow } = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.getScreenData().then();
      setAddPropertyFlow(false);
    });
  };

  public componentWillUnmount(): void {
    this.focusListener();
  }

  public render = (): React.ReactElement => {
    const { t } = this.props;
    const { isLoading, pendingProperties } = this.state;

    return (
      <AnimatedProfileHeader title={t('dashboard')}>
        <>
          {this.renderAssetMetricsAndUpdates()}
          <PendingPropertyListCard
            data={pendingProperties}
            onPressComplete={this.onCompleteDetails}
            onSelectAction={this.handleActionSelection}
          />
          <FinanceOverview />
          <AssetMarketTrends containerStyle={styles.assetCards} onViewAll={this.onViewAll} />
          <AssetAdvertisementBanner />
          <AssetSubscriptionPlan containerStyle={styles.assetCards} />
          <Loader visible={isLoading} />
        </>
      </AnimatedProfileHeader>
    );
  };

  public renderAssetMetricsAndUpdates = (): React.ReactElement => {
    const { metrics } = this.state;
    return (
      <>
        <AssetMetricsList
          title={`${metrics?.assetMetrics?.assets?.count ?? 0}`}
          data={metrics?.assetMetrics?.miscellaneous ?? []}
          subscription={metrics?.userServicePlan?.label}
          containerStyle={styles.assetCards}
          onMetricsClicked={this.handleMetricsNavigation}
        />
        <AssetSummary
          notification={metrics?.updates?.notifications?.count ?? 0}
          serviceTickets={metrics?.updates?.tickets?.count ?? 0}
          dues={metrics?.updates?.dues?.count ?? 0}
          containerStyle={styles.assetCards}
          onPressDue={this.handleDues}
          onPressNotification={this.handleNotification}
        />
      </>
    );
  };

  // HANDLERS
  private onCompleteDetails = (assetId: number): void => {
    const { navigation, setAssetId } = this.props;
    setAssetId(assetId);
    navigation.navigate(ScreensKeys.PropertyPostStack, {
      screen: ScreensKeys.AddProperty,
      params: { previousScreen: ScreensKeys.Dashboard },
    });
  };

  private onViewAll = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.MarketTrends);
  };

  private handleDues = (): void => {
    const { navigation } = this.props;
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ScreensKeys.Financials }],
      })
    );
  };

  private handleNotification = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.AssetNotifications, { isFromDashboard: true });
  };

  private handleMetricsNavigation = (name: string): void => {
    const { navigation, setCurrentFilter } = this.props;
    setCurrentFilter(name as Filters);
    // @ts-ignore
    navigation.navigate(ScreensKeys.Portfolio, {
      screen: ScreensKeys.PortfolioLandingScreen,
    });
  };

  private handleActionSelection = (item: IActions, assetId: number): void => {
    const { navigation, setSelectedPlan, setAssetId } = this.props;
    setSelectedPlan({ id: item.id, selectedPlan: item.type });
    setAssetId(assetId);
    navigation.navigate(ScreensKeys.PropertyPostStack, {
      screen: ScreensKeys.AssetLeaseListing,
      params: { previousScreen: ScreensKeys.Dashboard },
    });
  };
  // HANDLERS end

  // APIs
  private getScreenData = async (): Promise<void> => {
    await this.getAssetMetrics();
    await this.getPendingProperties();
  };

  private getAssetMetrics = async (): Promise<void> => {
    this.setState({ isLoading: true });
    try {
      const response: AssetMetrics = await DashboardRepository.getAssetMetrics();
      this.setState({ metrics: response, isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false });
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  private getPendingProperties = async (): Promise<void> => {
    try {
      const response: Asset[] = await AssetRepository.getPropertiesByStatus(PropertyStatus.PENDING);
      this.setState({ pendingProperties: response });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };
  // APIs end
}

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { setCurrentFilter } = PortfolioActions;
  const { setAddPropertyFlow } = UserActions;
  const { setAssetId, setSelectedPlan } = RecordAssetActions;
  return bindActionCreators({ setCurrentFilter, setAssetId, setSelectedPlan, setAddPropertyFlow }, dispatch);
};

export default connect(
  null,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.assetDashboard)(Dashboard));

const styles = StyleSheet.create({
  assetCards: {
    marginVertical: 12,
  },
});
