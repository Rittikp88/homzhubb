import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components';
import PropertyListCard from '@homzhub/mobile/src/components/organisms/PropertyListCard';

interface IProps {
  propertyId: number;
  onFavorite: (propertyId: number) => void;
}

type Props = WithTranslation & IProps;

interface ISimilarPropertiesState {
  similarProperties: any[];
}

class SimilarProperties extends React.PureComponent<Props, ISimilarPropertiesState> {
  public state = {
    similarProperties: [],
  };

  public componentDidMount(): void {
    // const { propertyId } = this.props;
    // await this.getSimilarProperties(propertyId);
  }

  public render(): React.ReactElement {
    const { t } = this.props;
    const { similarProperties } = this.state;
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

  public renderCarouselItem = (item: any): React.ReactElement => {
    const { onFavorite } = this.props;
    const onUpdateFavoritePropertyId = (propertyId: number): void => onFavorite(propertyId);
    return (
      <PropertyListCard
        property={item}
        onFavorite={onUpdateFavoritePropertyId}
        key={item.id}
        transaction_type={0} // TODO: To be checked
        isCarousel={false}
        containerStyle={styles.propertyCard}
        textSizeType="small"
      />
    );
  };

  private renderKeyExtractor = (item: any, index: number): string => {
    return `${item.id}-${index}`;
  };

  public getSimilarProperties = async (propertyId: number): Promise<void> => {
    const response = await AssetRepository.getSimilarProperties(propertyId);
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
