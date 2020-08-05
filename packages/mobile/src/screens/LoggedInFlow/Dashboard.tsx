import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AssetMetricsData } from '@homzhub/common/src/mocks/AssetMetrics';
import { theme } from '@homzhub/common/src/styles/theme';
import { AssetSummary } from '@homzhub/common/src/components';
import { AssetMetricsList } from '@homzhub/mobile/src/components/organisms/AssetMetricsList';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { LoggedInBottomTabNavigatorParamList } from '@homzhub/mobile/src/navigation/AppNavigator';

type libraryProps = NavigationScreenProps<LoggedInBottomTabNavigatorParamList, ScreensKeys.Dashboard>;
type Props = libraryProps;

export class Dashboard extends React.PureComponent<Props, {}> {
  public render = (): React.ReactElement => {
    return (
      <View style={styles.screen}>
        <AssetMetricsList
          assetCount={10}
          data={AssetMetricsData}
          subscription="Homzhub Pro"
          containerStyle={styles.assetCards}
        />
        <AssetSummary notification={10} serviceTickets={20} dues={30} containerStyle={styles.assetCards} />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    margin: theme.layout.screenPadding,
  },
  assetCards: {
    marginVertical: 10,
  },
});
