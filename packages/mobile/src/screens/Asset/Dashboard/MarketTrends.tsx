import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { AnimatedProfileHeader } from '@homzhub/mobile/src/components';
import AssetMarketTrends from '@homzhub/mobile/src/components/molecules/AssetMarketTrends';

interface IOwnState {
  scrollEnabled: boolean;
}
type libraryProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.MarketTrends>;
type Props = WithTranslation & libraryProps;

export class MarketTrends extends React.PureComponent<Props, IOwnState> {
  public state = {
    scrollEnabled: true,
  };

  public render = (): React.ReactElement => {
    const { t } = this.props;
    const { scrollEnabled } = this.state;
    return (
      <AnimatedProfileHeader
        keyboardShouldPersistTaps
        title={t('assetMore:more')}
        sectionHeader={t('marketTrends')}
        sectionTitleType="semiBold"
        onBackPress={this.handleIconPress}
        isOuterScrollEnabled={scrollEnabled}
      >
        <AssetMarketTrends shouldEnableOuterScroll={this.toggleScroll} onTrendPress={this.openWebView} />
      </AnimatedProfileHeader>
    );
  };

  private handleIconPress = (): void => {
    const { navigation, route } = this.props;

    if (route.params?.isFromDashboard ?? false) {
      navigation.navigate(ScreensKeys.DashboardLandingScreen);
      navigation.popToTop();
      return;
    }

    navigation.goBack();
  };

  private toggleScroll = (scrollEnabled: boolean): void => {
    this.setState({ scrollEnabled });
  };

  private openWebView = (url: string, trendId: number): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.WebViewScreen, { url, trendId });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(MarketTrends);
