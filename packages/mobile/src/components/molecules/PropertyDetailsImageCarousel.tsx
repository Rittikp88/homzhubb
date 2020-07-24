import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { ImageVideoPagination } from '@homzhub/common/src/components';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';

interface IProps {
  images: string[];
  toggleImage: () => void;
  updateSlide: (index: number) => void;
  activeSlide: number;
}

export class PropertyDetailsImageCarousel extends React.PureComponent<IProps> {
  public render(): React.ReactElement {
    const { activeSlide, images } = this.props;
    return (
      <View style={styles.carouselContainer}>
        <SnapCarousel
          carouselData={images}
          carouselItem={this.renderCarouselItem}
          activeIndex={activeSlide}
          sliderWidth={theme.viewport.width}
          itemWidth={theme.viewport.width}
          onSnapToItem={this.onSnapToItem}
        />
        <View style={styles.overlay}>
          <ImageVideoPagination currentSlide={activeSlide} totalSlides={images.length} type="image" />
        </View>
      </View>
    );
  }

  private renderCarouselItem = (item: string): React.ReactElement => {
    const { toggleImage } = this.props;
    return (
      <TouchableOpacity onPress={toggleImage}>
        <Image
          source={{
            uri: item,
          }}
          style={styles.carouselImage}
        />
      </TouchableOpacity>
    );
  };

  public onSnapToItem = (slideNumber: number): void => {
    const { updateSlide } = this.props;
    updateSlide(slideNumber);
  };
}

const styles = StyleSheet.create({
  carouselContainer: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 15,
    backgroundColor: theme.colors.carouselCardOpacity,
  },
  carouselImage: {
    height: '100%',
    width: '100%',
  },
});
