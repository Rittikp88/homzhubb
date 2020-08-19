import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AssetMetricsData, AssetSubscriptionPlanData, MarketTrendsData } from '@homzhub/common/src/mocks/AssetMetrics';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { BottomTabNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { AssetSummary } from '@homzhub/common/src/components';
import {
  AnimatedProfileHeader,
  AssetMarketTrends,
  AssetMetricsList,
  AssetSubscriptionPlan,
  AssetAdvertisementBanner,
  FinanceOverview,
} from '@homzhub/mobile/src/components';
import PendingPropertyListCard from '@homzhub/mobile/src/components/organisms/PendingPropertyListCard';

type libraryProps = WithTranslation & NavigationScreenProps<BottomTabNavigatorParamList, ScreensKeys.Dashboard>;
type Props = libraryProps;

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
          <AssetMarketTrends data={MarketTrendsData} containerStyle={styles.assetCards} />
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
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(Dashboard);

const styles = StyleSheet.create({
  assetCards: {
    marginVertical: 12,
  },
});
