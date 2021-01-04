import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import AssetMarketTrends from '@homzhub/mobile/src/components/molecules/AssetMarketTrends';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';

interface IOwnState {
  scrollEnabled: boolean;
}
type libraryProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.MarketTrends>;
type Props = WithTranslation & libraryProps;

export class MarketTrends extends React.PureComponent<Props> {
  public render = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <UserScreen
        title={t('assetMore:more')}
        pageTitle={t('assetMore:marketTrends')}
        onBackPress={this.handleIconPress}
        scrollEnabled={false}
      >
        <AssetMarketTrends onTrendPress={this.openWebView} />
      </UserScreen>
    );
  };

  private handleIconPress = (): void => {
    const { navigation, route } = this.props;

    if (route.params?.isFromDashboard ?? false) {
      // @ts-ignore
      navigation.navigate(ScreensKeys.DashboardLandingScreen);
      navigation.popToTop();
      return;
    }

    navigation.goBack();
  };

  private openWebView = (url: string, trendId: number): void => {
    const { navigation } = this.props;
    // @ts-ignore
    navigation.navigate(ScreensKeys.WebViewScreen, { url, trendId });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(MarketTrends);
