import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { DashboardNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { Header } from '@homzhub/mobile/src/components';
import AssetMarketTrends from '@homzhub/mobile/src/components/molecules/AssetMarketTrends';

type libraryProps = NavigationScreenProps<DashboardNavigatorParamList, ScreensKeys.MarketTrends>;
type Props = WithTranslation & libraryProps;

class MarketTrends extends React.PureComponent<Props> {
  public render = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <View style={styles.container}>
        <Header
          type="primary"
          icon={icons.leftArrow}
          onIconPress={this.handleIconPress}
          isHeadingVisible
          title={t('marketTrends')}
        />
        <AssetMarketTrends limit={100} isHeaderVisible={false} containerStyle={styles.marketTrends} />
      </View>
    );
  };

  public handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(MarketTrends);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marketTrends: {
    padding: theme.layout.screenPadding,
  },
});
