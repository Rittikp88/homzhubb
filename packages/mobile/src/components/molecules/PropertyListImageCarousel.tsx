import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { cloneDeep, remove } from 'lodash';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Favorite } from '@homzhub/common/src/components';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';

interface IProps {
  images: Attachment[];
  isFavorite: boolean;
  onFavorite: () => void;
  isCarousel: boolean;
}

interface IPropertyListImageCarouselState {
  ref: any;
  activeSlide: number;
}

export class PropertyListImageCarousel extends React.PureComponent<IProps, IPropertyListImageCarouselState> {
  public state = {
    activeSlide: 0,
    ref: null,
  };

  public render(): React.ReactElement {
    const { images, isFavorite, onFavorite, isCarousel } = this.props;
    const { activeSlide } = this.state;
    const clonedImages = cloneDeep(images);
    remove(clonedImages, (image: Attachment) => image.mediaType === 'VIDEO');
    const sortedImages = clonedImages.sort((a, b) => {
      // @ts-ignore
      return b.is_cover_image - a.is_cover_image;
    });
    if (sortedImages.length === 0) {
      sortedImages.push({
        link:
          'https://www.investopedia.com/thmb/7GOsX_NmY3KrIYoZPWOu6SldNFI=/735x0/houses_and_land-5bfc3326c9e77c0051812eb3.jpg',
        isCoverImage: true,
        fileName: 'sample',
        mediaType: 'IMAGE',
        // @ts-ignore
        mediaAttributes: {},
      });
    }
    return (
      <View style={styles.carouselContainer}>
        {!isCarousel ? (
          this.renderCarouselItem(sortedImages[0])
        ) : (
          <SnapCarousel
            bubbleRef={this.updateRef}
            carouselData={sortedImages}
            carouselItem={this.renderCarouselItem}
            activeIndex={activeSlide}
            sliderWidth={360}
            onSnapToItem={this.onSnapToItem}
          />
        )}
        <View style={styles.overlay}>
          <View style={styles.favoriteContainer}>
            <Favorite onFavorite={onFavorite} containerStyle={isFavorite ? styles.favorite : styles.nonFavorite} />
          </View>
          {isCarousel && (
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
                color={activeSlide === sortedImages.length - 1 ? theme.colors.disabledPreference : theme.colors.white}
                onPress={this.nextSlide}
              />
            </View>
          )}
        </View>
      </View>
    );
  }

  private renderCarouselItem = (item: Attachment): React.ReactElement => {
    return (
      <Image
        source={{
          uri: item.link,
        }}
        style={styles.carouselImage}
      />
    );
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
  favorite: {
    backgroundColor: theme.colors.primaryColor,
    padding: 4,
    borderRadius: 4,
  },
  nonFavorite: {
    backgroundColor: theme.colors.transparent,
  },
});
