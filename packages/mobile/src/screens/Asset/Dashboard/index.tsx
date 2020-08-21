import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { DashboardNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { AssetSummary } from '@homzhub/common/src/components';
import {
  AnimatedProfileHeader,
  AssetMetricsList,
  AssetAdvertisementBanner,
  FinanceOverview,
  StateAwareComponent,
} from '@homzhub/mobile/src/components';
import PendingPropertyListCard from '@homzhub/mobile/src/components/organisms/PendingPropertyListCard';
import AssetMarketTrends from '@homzhub/mobile/src/components/molecules/AssetMarketTrends';
import AssetSubscriptionPlan from '@homzhub/mobile/src/components/molecules/AssetSubscriptionPlan';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';

type libraryProps = NavigationScreenProps<DashboardNavigatorParamList, ScreensKeys.DashboardLandingScreen>;
type Props = WithTranslation & libraryProps;

interface IDashboardState {
  metrics: AssetMetrics;
  isLoading: boolean;
}

class Dashboard extends React.PureComponent<Props, IDashboardState> {
  public state = {
    metrics: {} as AssetMetrics,
    isLoading: false,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getAssetMetrics();
  };

  public render = (): React.ReactNode => {
    const { isLoading } = this.state;
    return <StateAwareComponent loading={isLoading} renderComponent={this.renderComponent()} />;
  };

  public renderComponent = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <AnimatedProfileHeader title={t('dashboard')}>
        <>
          {this.renderAssetMetricsAndUpdates()}
          <PendingPropertyListCard />
          <FinanceOverview />
          <AssetMarketTrends containerStyle={styles.assetCards} onViewAll={this.onViewAll} />
          <AssetAdvertisementBanner />
          <AssetSubscriptionPlan containerStyle={styles.assetCards} />
        </>
      </AnimatedProfileHeader>
    );
  };

  public renderAssetMetricsAndUpdates = (): React.ReactElement => {
    const { metrics } = this.state;
    return (
      <>
        <AssetMetricsList
          assetCount={metrics?.assetMetrics?.assets?.count ?? 0}
          data={metrics?.assetMetrics?.miscellaneous}
          subscription={metrics?.userServicePlan?.label}
          containerStyle={styles.assetCards}
        />
        <AssetSummary
          notification={metrics?.updates?.notifications?.count ?? 0}
          serviceTickets={metrics?.updates?.tickets?.count ?? 0}
          dues={metrics?.updates?.dues?.count ?? 0}
          containerStyle={styles.assetCards}
        />
      </>
    );
  };

  public onViewAll = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.MarketTrends);
  };

  public getAssetMetrics = async (): Promise<void> => {
    this.setState({ isLoading: true });
    const response: AssetMetrics = await DashboardRepository.getAssetMetrics();
    this.setState({ metrics: response, isLoading: false });
  };

  private setLoadingState = (loading: boolean): void => {
    this.setState({ isLoading: loading });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(Dashboard);

const styles = StyleSheet.create({
  assetCards: {
    marginVertical: 12,
  },
});
