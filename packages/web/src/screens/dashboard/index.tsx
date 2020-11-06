import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { theme } from '@homzhub/common/src/styles/theme';
import PendingProperties from '@homzhub/web/src/screens/dashboard/components/PendingProperties';
import MarketTrendsCarousel from '@homzhub/web/src/screens/dashboard/components/MarketTrendsCarousel';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import MockAssetData from '@homzhub/web/src/screens/dashboard/components/MockAssetData.json';

class Dashboard extends React.PureComponent {
  public render(): React.ReactNode {
    const data = ObjectMapper.deserializeArray(Asset, (MockAssetData as unknown) as Asset[]);
    return (
      <View style={styles.container}>
        <PendingProperties data={data} />
        <MarketTrendsCarousel />
      </View>
    );
  }
}

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.background,
  },
});
