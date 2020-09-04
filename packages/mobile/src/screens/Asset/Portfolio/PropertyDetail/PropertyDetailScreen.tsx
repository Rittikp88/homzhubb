import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { PortfolioNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { TopTabs } from '@homzhub/mobile/src/navigation/TopTabs';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { PortfolioSelectors } from '@homzhub/common/src/modules/portfolio/selectors';
import { AnimatedProfileHeader } from '@homzhub/mobile/src/components';
import AssetCard from '@homzhub/mobile/src/components/organisms/AssetCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';

interface IStateProps {
  propertyData: Asset | null;
}

type libraryProps = NavigationScreenProps<PortfolioNavigatorParamList, ScreensKeys.PropertyDetailScreen>;
type Props = WithTranslation & libraryProps & IStateProps;

export class PropertyDetailScreen extends Component<Props> {
  public render = (): React.ReactNode => {
    const { t, propertyData } = this.props;
    if (!propertyData) {
      return null;
    }
    return (
      <AnimatedProfileHeader title={t('portfolio')}>
        <>
          <View style={styles.header}>
            <Icon
              name={icons.leftArrow}
              size={20}
              color={theme.colors.primaryColor}
              onPress={this.handleIconPress}
              testID="icnBack"
            />
            <Text type="small" textType="semiBold" style={styles.headerTitle}>
              {t('propertyDetails')}
            </Text>
          </View>
          <AssetCard assetData={propertyData} isDetailView />
          <TopTabs />
        </>
      </AnimatedProfileHeader>
    );
  };

  private handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    propertyData: PortfolioSelectors.getAssetById(state),
  };
};

export default connect(
  mapStateToProps,
  null
)(withTranslation(LocaleConstants.namespacesKey.assetPortfolio)(PropertyDetailScreen));

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  headerTitle: {
    color: theme.colors.darkTint1,
    marginLeft: 12,
  },
});
