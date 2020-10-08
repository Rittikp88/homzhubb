import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { AnimatedProfileHeader, HeaderCard } from '@homzhub/mobile/src/components';
import SiteVisitTab from '@homzhub/mobile/src/components/organisms/SiteVisitTab';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

type libraryProps = NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.PropertyVisits>;
type Props = WithTranslation & libraryProps;

class PropertyVisits extends Component<Props> {
  public render(): React.ReactNode {
    const { t } = this.props;
    return (
      <AnimatedProfileHeader isOuterScrollEnabled={false} title={t('assetMore:propertyVisits')}>
        <HeaderCard
          title={t('assetMore:propertyVisits')}
          renderItem={this.renderPropertyVisits}
          onIconPress={this.handleBack}
        />
      </AnimatedProfileHeader>
    );
  }

  private renderPropertyVisits = (): React.ReactElement => {
    return <SiteVisitTab />;
  };

  private handleBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

export default withTranslation()(PropertyVisits);
