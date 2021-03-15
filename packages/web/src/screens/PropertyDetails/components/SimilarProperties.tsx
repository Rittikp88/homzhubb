import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import PropertySearchCard from '@homzhub/web/src/screens/searchProperty/components/PropertySearchCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  isMobile: boolean;
  isTablet: boolean;
  propertyTermId: number;
}

type Props = IProps & WithTranslation;

interface ISimilarPropertiesState {
  similarProperties: Asset[];
}

export class SimilarProperties extends React.PureComponent<Props, ISimilarPropertiesState> {
  public state = {
    similarProperties: [],
  };

  public componentDidMount = async (): Promise<void> => {
    const { propertyTermId } = this.props;
    await this.getSimilarProperties(propertyTermId);
  };

  public render(): React.ReactNode {
    const { t, isMobile, isTablet } = this.props;
    const { similarProperties } = this.state;

    if (similarProperties.length === 0) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Typography variant="text" size="regular" fontWeight="semiBold">
          {t('similarProperties')}
        </Typography>
        <View style={styles.similarCard}>
          {similarProperties.map((item: Asset) => {
            return (
              <View style={[styles.card, isTablet && styles.tabCard, isMobile && styles.mobileCard]} key={item.id}>
                <PropertySearchCard
                  investmentData={item}
                  priceUnit="mo"
                  isFooterRequired={false}
                  cardImageCarouselStyle={styles.carouselStyle}
                  cardImageStyle={styles.imageStyle}
                />
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  public getSimilarProperties = async (propertyTermId: number): Promise<void> => {
    // TODO: Add route navigation for getting property ID and transaction_type
    const transaction_type = 0;
    const response = await AssetRepository.getSimilarProperties(propertyTermId, transaction_type);
    this.setState({ similarProperties: response });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDescription)(SimilarProperties);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginBottom: 24,
  },
  similarProperties: {
    color: theme.colors.darkTint4,
  },
  similarCard: {
    top: 20,
    flexDirection: 'row',
  },
  card: {
    width: '34%',
    justifyContent: 'space-between',
  },
  mobileCard: {
    width: '90%',
  },
  tabCard: {
    width: '48%',
  },
  carouselStyle: {
    height: 210,
    width: '100%',
  },
  imageStyle: {
    height: 210,
    width: '100%',
  },
});
