import React from 'react';
import { StyleSheet } from 'react-native';
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
  AssetAdvertisementBanner,
  AssetMetricsList,
  AssetSummary,
} from '@homzhub/mobile/src/components';
import AssetMarketTrends from '@homzhub/mobile/src/components/molecules/AssetMarketTrends';
import UserSubscriptionPlan from '@homzhub/common/src/components/molecules/UserSubscriptionPlan';
import FinanceOverview from '@homzhub/mobile/src/components/organisms/FinanceOverview';
import PendingPropertyListCard from '@homzhub/mobile/src/components/organisms/PendingPropertyListCard';
import { Asset, PropertyStatus } from '@homzhub/common/src/domain/models/Asset';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { IActions, ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { DashboardNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { ISetAssetPayload } from '@homzhub/common/src/modules/portfolio/interfaces';
import { IApiClientError } from '@homzhub/common/src/network/ApiClientError';

interface IDispatchProps {
  setCurrentFilter: (payload: Filters) => void;
  setAssetId: (payload: number) => void;
  setSelectedPlan: (payload: ISelectedAssetPlan) => void;
  setAddPropertyFlow: (payload: boolean) => void;
  setCurrentAsset: (payload: ISetAssetPayload) => void;
}

type libraryProps = NavigationScreenProps<DashboardNavigatorParamList, ScreensKeys.DashboardLandingScreen>;
type Props = WithTranslation & libraryProps & IDispatchProps;

interface IDashboardState {
  metrics: AssetMetrics;
  pendingProperties: Asset[];
  isLoading: boolean;
}

const ShowInMvpRelease = false;

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
      <AnimatedProfileHeader loading={isLoading} isGradientHeader title={t('dashboard')}>
        <>
          {this.renderAssetMetricsAndUpdates()}
          {pendingProperties.length > 0 && (
            <PendingPropertyListCard
              data={pendingProperties}
              onPressComplete={this.onCompleteDetails}
              onSelectAction={this.handleActionSelection}
              onViewProperty={this.onViewProperty}
            />
          )}
          <FinanceOverview />
          <AssetMarketTrends isDashboard onViewAll={this.onViewAll} onTrendPress={this.onTrendPress} />
          <AssetAdvertisementBanner />
          {ShowInMvpRelease && <UserSubscriptionPlan onApiFailure={this.onAssetSubscriptionApiFailure} />}
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
          onMetricsClicked={this.handleMetricsNavigation}
        />
        <AssetSummary
          notification={metrics?.updates?.notifications?.count ?? 0}
          serviceTickets={metrics?.updates?.tickets?.count ?? 0}
          dues={metrics?.updates?.dues?.count ?? 0}
          containerStyle={styles.assetCards}
          onPressDue={this.handleDues}
          onPressServiceTickets={this.handleServiceTickets}
          onPressNotification={this.handleNotification}
        />
      </>
    );
  };

  // HANDLERS
  private onAssetSubscriptionApiFailure = (err: IApiClientError): void => {
    AlertHelper.error({ message: ErrorUtils.getErrorMessage(err) });
  };

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
    navigation.navigate(ScreensKeys.More, {
      screen: ScreensKeys.MarketTrends,
      initial: false,
      params: { isFromDashboard: true },
    });
  };

  private onTrendPress = (url: string, trendId: number): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.WebViewScreen, { url, trendId });
  };

  private onViewProperty = (data: ISetAssetPayload): void => {
    const { setCurrentAsset, navigation } = this.props;
    setCurrentAsset(data);
    navigation.navigate(ScreensKeys.PropertyDetailScreen, { isFromDashboard: true });
  };

  private handleDues = (): void => {
    /**
     *
     navigation.dispatch(
     CommonActions.reset({
        index: 0,
        routes: [{ name: ScreensKeys.Financials }],
      })
     );
     */
    const { navigation, t } = this.props;

    navigation.navigate(ScreensKeys.ComingSoonScreen, { title: t('dues'), tabHeader: t('dashboard') });
  };

  private handleServiceTickets = (): void => {
    const { navigation, t } = this.props;

    navigation.navigate(ScreensKeys.ComingSoonScreen, { title: t('tickets'), tabHeader: t('dashboard') });
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
  const { setCurrentFilter, setCurrentAsset } = PortfolioActions;
  const { setAddPropertyFlow } = UserActions;
  const { setAssetId, setSelectedPlan } = RecordAssetActions;
  return bindActionCreators(
    { setCurrentFilter, setAssetId, setSelectedPlan, setAddPropertyFlow, setCurrentAsset },
    dispatch
  );
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
