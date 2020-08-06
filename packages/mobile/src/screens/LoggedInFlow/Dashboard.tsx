import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { AssetMetricsData, AssetSubscriptionPlanData, MarketTrendsData } from '@homzhub/common/src/mocks/AssetMetrics';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LoggedInBottomTabNavigatorParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { theme } from '@homzhub/common/src/styles/theme';
import { AssetSummary } from '@homzhub/common/src/components';
import { AssetMarketTrends, AssetMetricsList, AssetSubscriptionPlan } from '@homzhub/mobile/src/components';
import PendingPropertyListCard from '@homzhub/mobile/src/components/organisms/PendingPropertyListCard';

type libraryProps = NavigationScreenProps<LoggedInBottomTabNavigatorParamList, ScreensKeys.Dashboard>;
type Props = libraryProps;

export class Dashboard extends React.PureComponent<Props, {}> {
  public render = (): React.ReactElement => {
    return (
      <SafeAreaView style={styles.flexOne}>
        <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
          <AssetMetricsList
            assetCount={10}
            data={AssetMetricsData}
            subscription="Homzhub Pro"
            containerStyle={styles.assetCards}
          />
          <AssetSummary notification={10} serviceTickets={20} dues={30} containerStyle={styles.assetCards} />
          <PendingPropertyListCard />
          <AssetMarketTrends data={MarketTrendsData} containerStyle={styles.assetCards} />
          <AssetSubscriptionPlan
            data={AssetSubscriptionPlanData}
            planName="Homzhub PRO"
            containerStyle={styles.assetCards}
          />
        </ScrollView>
      </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    margin: theme.layout.screenPadding,
  },
  assetCards: {
    marginVertical: 12,
  },
  flexOne: {
    flex: 1,
  },
});
