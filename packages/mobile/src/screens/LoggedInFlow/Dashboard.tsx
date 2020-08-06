import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AssetMetricsData, AssetSubscriptionPlanData, MarketTrendsData } from '@homzhub/common/src/mocks/AssetMetrics';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LoggedInBottomTabNavigatorParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { AssetSummary } from '@homzhub/common/src/components';
import {
  AssetMarketTrends,
  AssetMetricsList,
  AssetSubscriptionPlan,
  AssetAdvertisementBanner,
  AnimatedProfileHeader,
} from '@homzhub/mobile/src/components';
import PendingPropertyListCard from '@homzhub/mobile/src/components/organisms/PendingPropertyListCard';

type libraryProps = WithTranslation & NavigationScreenProps<LoggedInBottomTabNavigatorParamList, ScreensKeys.Dashboard>;
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
            subscription="Homzhub Pro"
            containerStyle={styles.assetCards}
          />
          <AssetSummary notification={10} serviceTickets={20} dues={30} containerStyle={styles.assetCards} />
          <PendingPropertyListCard />
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
