import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import PropertyListCard from '@homzhub/mobile/src/components/organisms/PropertyListCard';

interface IProps {
  data: any[];
  onFavorite: (propertyId: number) => void;
}

interface ISimilarPropertiesState {
  activeSlide: number;
}

type Props = WithTranslation & IProps;

class SimilarProperties extends React.PureComponent<Props, ISimilarPropertiesState> {
  public state = {
    activeSlide: 0,
  };

  public render(): React.ReactElement {
    const { data, t } = this.props;
    const { activeSlide } = this.state;
    return (
      <View style={styles.container}>
        <Text type="small" textType="semiBold" style={styles.similarProperties}>
          {t('similarProperties')}
        </Text>
        <SnapCarousel
          carouselData={data}
          carouselItem={this.renderCarouselItem}
          activeIndex={activeSlide}
          itemWidth={theme.viewport.width - 20}
          onSnapToItem={this.onSnapToItem}
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
      />
    );
  };

  public onSnapToItem = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.assetDescription)(SimilarProperties);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    marginVertical: 22,
  },
  similarProperties: {
    color: theme.colors.darkTint4,
  },
  propertyCard: {
    width: theme.viewport.width * 0.9,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});
