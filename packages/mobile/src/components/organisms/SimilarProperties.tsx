import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components';
import PropertyListCard from '@homzhub/mobile/src/components/organisms/PropertyListCard';
import { Asset } from '@homzhub/common/src/domain/models/Asset';

interface IProps {
  propertyTermId: number;
  onFavorite: (propertyId: number) => void;
  onSelectedProperty: (propertyTermId: number, propertyId: number) => void;
  transaction_type: number;
}

type Props = WithTranslation & IProps;

interface ISimilarPropertiesState {
  similarProperties: Asset[];
}

class SimilarProperties extends React.PureComponent<Props, ISimilarPropertiesState> {
  public state = {
    similarProperties: [],
  };

  public componentDidMount = async (): Promise<void> => {
    const { propertyTermId } = this.props;
    await this.getSimilarProperties(propertyTermId);
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    const { similarProperties } = this.state;
    if (similarProperties.length === 0) {
      return null;
    }
    return (
      <View style={styles.container}>
        <Text type="small" textType="semiBold" style={styles.similarProperties}>
          {t('similarProperties')}
        </Text>
        <FlatList
          data={similarProperties}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }: { item: any }): React.ReactElement => this.renderCarouselItem(item)}
          removeClippedSubviews
          keyExtractor={this.renderKeyExtractor}
        />
      </View>
    );
  }

  public renderCarouselItem = (item: Asset): React.ReactElement => {
    const { onFavorite, transaction_type, onSelectedProperty } = this.props;
    const { leaseTerm, saleTerm, id } = item;
    const onUpdateFavoritePropertyId = (propertyId: number): void => onFavorite(propertyId);
    const navigateToSelectedProperty = (): void => {
      if (leaseTerm) {
        onSelectedProperty(leaseTerm.id, id);
      }
      if (saleTerm) {
        onSelectedProperty(saleTerm.id, id);
      }
    };
    return (
      <PropertyListCard
        property={item}
        onFavorite={onUpdateFavoritePropertyId}
        key={item.id}
        transaction_type={transaction_type}
        isCarousel={false}
        containerStyle={styles.propertyCard}
        textSizeType="small"
        onSelectedProperty={navigateToSelectedProperty}
      />
    );
  };

  private renderKeyExtractor = (item: any, index: number): string => {
    return `${item.id}-${index}`;
  };

  public getSimilarProperties = async (propertyTermId: number): Promise<void> => {
    const { transaction_type } = this.props;
    const response = await AssetRepository.getSimilarProperties(propertyTermId, transaction_type);
    this.setState({ similarProperties: response });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDescription)(SimilarProperties);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 24,
  },
  similarProperties: {
    color: theme.colors.darkTint4,
  },
  propertyCard: {
    width: theme.viewport.width - 80,
    marginHorizontal: 10,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 3,
  },
});
