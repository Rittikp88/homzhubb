import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { DashboardNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { AnimatedProfileHeader } from '@homzhub/mobile/src/components';
import AssetMarketTrends from '@homzhub/mobile/src/components/molecules/AssetMarketTrends';

type libraryProps = NavigationScreenProps<DashboardNavigatorParamList, ScreensKeys.MarketTrends>;
type Props = WithTranslation & libraryProps;

export class MarketTrends extends React.PureComponent<Props> {
  public render = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <AnimatedProfileHeader
        title={t('dashboard')}
        sectionHeader={t('marketTrends')}
        sectionTitleType="semiBold"
        onBackPress={this.handleIconPress}
      >
        <AssetMarketTrends limit={100} isHeaderVisible={false} />
      </AnimatedProfileHeader>
    );
  };

  public handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDashboard)(MarketTrends);
