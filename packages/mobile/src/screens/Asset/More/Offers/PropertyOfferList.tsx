import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { theme } from '@homzhub/common/src/styles/theme';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import PropertyOffers from '@homzhub/common/src/components/molecules/PropertyOffers';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { propertyOffer } from '@homzhub/common/src/mocks/PropertyOffer';

type Props = WithTranslation & NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.PropertyOfferList>;

class PropertyOfferList extends React.PureComponent<Props> {
  public render(): React.ReactElement {
    const { t } = this.props;

    const data = ObjectMapper.deserializeArray(Asset, propertyOffer);
    return (
      <>
        <UserScreen title={t('assetDashboard:dashboard')} scrollEnabled backgroundColor={theme.colors.transparent}>
          {data.map((property: Asset, index: number) => {
            return this.renderPropertyOffer(property, index);
          })}
        </UserScreen>
      </>
    );
  }

  public renderPropertyOffer = (item: Asset, index: number): React.ReactElement => {
    const separatorStyle = index !== 0 ? styles.separator : {};
    const isCardExpanded = index === 0;

    return <PropertyOffers isCardExpanded={isCardExpanded} propertyOffer={item} containerStyles={separatorStyle} />;
  };
}

export default withTranslation()(PropertyOfferList);

const styles = StyleSheet.create({
  separator: {
    marginTop: 16,
  },
});
