import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { ImageVideoPagination, YoutubeVideo } from '@homzhub/common/src/components';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';

interface IProps {
  images: any;
  enterFullScreen: () => void;
  updateSlide: (index: number) => void;
  activeSlide: number;
}

export class AssetDetailsImageCarousel extends React.PureComponent<IProps> {
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
        {images[activeSlide].attachment_type === 'IMAGE' && (
          <View style={styles.overlay}>
            <ImageVideoPagination
              currentSlide={activeSlide}
              totalSlides={images.length}
              type={images[activeSlide].attachment_type}
            />
          </View>
        )}
      </View>
    );
  }

  private renderCarouselItem = (item: any): React.ReactElement => {
    const { enterFullScreen } = this.props;
    if (item.attachment_type === 'IMAGE') {
      return (
        <TouchableOpacity onPress={enterFullScreen}>
          <Image
            source={{
              uri: item.link,
            }}
            style={styles.carouselImage}
          />
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.carouselVideo}>
        <YoutubeVideo url={item.link} play={false} />
      </View>
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
    backgroundColor: theme.colors.darkTint1,
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
  carouselVideo: {
    marginTop: PlatformUtils.isAndroid() ? 65 : 30,
  },
});
