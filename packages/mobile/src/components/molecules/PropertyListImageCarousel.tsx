import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Favorite } from '@homzhub/common/src/components';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';

interface IProps {
  images: string[];
  isFavorite: boolean;
  onFavorite: () => void;
}

interface IPropertyListImageCarouselState {
  ref: any;
  activeSlide: number;
}

class PropertyListImageCarousel extends React.PureComponent<IProps, IPropertyListImageCarouselState> {
  public state = {
    activeSlide: 0,
    ref: null,
  };

  public render(): React.ReactElement {
    const { images, isFavorite, onFavorite } = this.props;
    const { activeSlide } = this.state;
    return (
      <View style={styles.carouselContainer}>
        <SnapCarousel
          bubbleRef={this.updateRef}
          carouselData={images}
          carouselItem={this.renderCarouselItem}
          activeIndex={activeSlide}
          sliderWidth={360}
          onSnapToItem={this.onSnapToItem}
        />
        <View style={styles.overlay}>
          <View style={styles.favoriteContainer}>
            <Favorite isFavorite={isFavorite} onFavorite={onFavorite} />
          </View>
          <View style={styles.arrowContainer}>
            <Icon
              name={icons.leftArrow}
              size={25}
              color={activeSlide === 0 ? theme.colors.disabledPreference : theme.colors.white}
              onPress={this.previousSlide}
            />
            <Icon
              name={icons.rightArrow}
              size={25}
              color={activeSlide === images.length - 1 ? theme.colors.disabledPreference : theme.colors.white}
              onPress={this.nextSlide}
            />
          </View>
        </View>
      </View>
    );
  }

  private renderCarouselItem = (item: string): React.ReactElement => {
    return <Image source={{ uri: item }} style={styles.carouselImage} />;
  };

  public onSnapToItem = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  public updateRef = (ref: any): void => {
    this.setState({ ref });
  };

  public previousSlide = (): void => {
    const { ref } = this.state;
    // @ts-ignore
    ref.snapToPrev();
  };

  public nextSlide = (): void => {
    const { ref } = this.state;
    // @ts-ignore
    ref.snapToNext();
  };
}

export default PropertyListImageCarousel;

const styles = StyleSheet.create({
  carouselContainer: {
    borderRadius: 4,
    height: 210,
    overflow: 'hidden',
  },
  favoriteContainer: {
    flexDirection: 'row-reverse',
    margin: 15,
  },
  arrowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 8,
    marginVertical: 40,
  },
  overlay: {
    position: 'absolute',
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.carouselCardOpacity,
  },
  carouselImage: {
    height: '100%',
    width: '100%',
  },
});
