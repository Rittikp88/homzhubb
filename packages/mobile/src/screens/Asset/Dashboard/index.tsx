import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AssetMetricsData, AssetSubscriptionPlanData } from '@homzhub/common/src/mocks/AssetMetrics';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
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

type libraryProps = NavigationScreenProps<DashboardNavigatorParamList, ScreensKeys.DashboardLandingScreen>;
type Props = WithTranslation & libraryProps;

class Dashboard extends React.PureComponent<Props, {}> {
  public render = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <AnimatedProfileHeader title={t('dashboard')}>
        <>
          <AssetMetricsList
            assetCount={10}
            data={AssetMetricsData}
            subscription="HomzHub Pro"
            containerStyle={styles.assetCards}
          />
          <AssetSummary notification={10} serviceTickets={20} dues={30} containerStyle={styles.assetCards} />
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

  public onViewAll = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.MarketTrends);
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(Dashboard);

const styles = StyleSheet.create({
  assetCards: {
    marginVertical: 12,
  },
});
