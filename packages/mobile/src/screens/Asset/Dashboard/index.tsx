import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AssetSubscriptionPlanData } from '@homzhub/common/src/mocks/AssetMetrics';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { DashboardNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { AssetSummary } from '@homzhub/common/src/components';
import {
  AnimatedProfileHeader,
  AssetMetricsList,
  AssetSubscriptionPlan,
  AssetAdvertisementBanner,
  FinanceOverview,
} from '@homzhub/mobile/src/components';
import PendingPropertyListCard from '@homzhub/mobile/src/components/organisms/PendingPropertyListCard';
import AssetMarketTrends from '@homzhub/mobile/src/components/molecules/AssetMarketTrends';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';

type libraryProps = NavigationScreenProps<DashboardNavigatorParamList, ScreensKeys.DashboardLandingScreen>;
type Props = WithTranslation & libraryProps;

interface IDashboardState {
  metrics: AssetMetrics;
}

class Dashboard extends React.PureComponent<Props, IDashboardState> {
  public state = {
    metrics: {} as AssetMetrics,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getAssetMetrics();
  };

  public render = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <AnimatedProfileHeader title={t('dashboard')}>
        <>
          {this.renderAssetMetricsAndUpdates()}
          <PendingPropertyListCard />
          <FinanceOverview />
          <AssetMarketTrends containerStyle={styles.assetCards} onViewAll={this.onViewAll} />
          <AssetAdvertisementBanner />
          <AssetSubscriptionPlan
            data={AssetSubscriptionPlanData}
            planName="Homzhub PRO"
            containerStyle={styles.assetCards}
          />
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
    const response: AssetMetrics = await DashboardRepository.getAssetMetrics();
    this.setState({ metrics: response });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(Dashboard);

const styles = StyleSheet.create({
  assetCards: {
    marginVertical: 12,
  },
});
