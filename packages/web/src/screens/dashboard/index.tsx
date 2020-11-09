import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { theme } from '@homzhub/common/src/styles/theme';
import { PendingPropertiesCard } from '@homzhub/web/src/components';
import MarketTrendsCarousel from '@homzhub/web/src/screens/dashboard/components/MarketTrendsCarousel';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
// TODO: (Bishal) remove this mock file and replace with data from api
import MockAssetData from '@homzhub/web/src/screens/dashboard/components/MockAssetData.json';

class Dashboard extends React.PureComponent {
  public render(): React.ReactNode {
    // TODO: (Bishal) - remove this once api is integrated
    const data = ObjectMapper.deserializeArray(Asset, (MockAssetData as unknown) as Asset[]);
    return (
      <View style={styles.container}>
        <PendingPropertiesCard data={data} />
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
