import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WithTranslation, withTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components';
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
        <Label type="large" textType="semiBold" style={styles.similarProperties}>
          {t('similarProperties')}
        </Label>
        <SnapCarousel
          carouselData={data}
          carouselItem={this.renderCarouselItem}
          activeIndex={activeSlide}
          itemWidth={theme.viewport.width - 65}
          sliderWidth={theme.viewport.width - 61}
          onSnapToItem={this.onSnapToItem}
          containerStyle={styles.carouselContainer}
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
        containerStyle={styles.containerStyle}
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
    flex: 1,
    backgroundColor: theme.colors.white,
    marginVertical: 20,
  },
  similarProperties: {
    color: theme.colors.darkTint4,
  },
  containerStyle: {
    borderColor: theme.colors.darkTint4,
    borderWidth: 1,
  },
  carouselContainer: {
    width: theme.viewport.width - 50,
  },
});
