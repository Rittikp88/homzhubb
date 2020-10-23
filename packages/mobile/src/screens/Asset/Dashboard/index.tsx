import React from 'react';
import { StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { DashboardNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
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
import FinanceOverview from '@homzhub/mobile/src/components/organisms/FinanceOverview';
import PendingPropertyListCard from '@homzhub/mobile/src/components/organisms/PendingPropertyListCard';
import AssetMarketTrends from '@homzhub/mobile/src/components/molecules/AssetMarketTrends';
import AssetSubscriptionPlan from '@homzhub/mobile/src/components/molecules/AssetSubscriptionPlan';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { IActions, ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';

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
  isLoading: boolean;
}

export class Dashboard extends React.PureComponent<Props, IDashboardState> {
  public focusListener: any;

  public state = {
    metrics: {} as AssetMetrics,
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
    const { isLoading } = this.state;
    return (
      <AnimatedProfileHeader title={t('dashboard')}>
        <>
          {this.renderAssetMetricsAndUpdates()}
          <PendingPropertyListCard
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

  private getScreenData = async (): Promise<void> => {
    await this.getAssetMetrics();
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
