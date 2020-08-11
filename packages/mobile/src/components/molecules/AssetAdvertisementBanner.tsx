import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { AssetAdvertisementData } from '@homzhub/common/src/mocks/AssetMetrics';
import { theme } from '@homzhub/common/src/styles/theme';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { PaginationComponent } from '@homzhub/mobile/src/components/atoms/PaginationComponent';

interface IAssetAdvertisementBannerState {
  banners: any[];
  activeSlide: number;
}

export class AssetAdvertisementBanner extends React.PureComponent<{}, IAssetAdvertisementBannerState> {
  public state = {
    banners: AssetAdvertisementData, // TODO: Needs to be empty array once api is integrated
    activeSlide: 0,
  };

  // TODO: Call the api here
  // public componentDidMount = async (): Promise<void> => {
  //   await this.fetchAdvertisementBanners();
  // };

  public render(): React.ReactNode {
    const { banners, activeSlide } = this.state;
    if (banners.length === 0) {
      return null;
    }
    return (
      <View style={styles.container}>
        <SnapCarousel
          carouselData={banners}
          carouselItem={this.renderCarouselItem}
          itemWidth={theme.viewport.width}
          activeIndex={activeSlide}
          onSnapToItem={this.onSnapToItem}
        />
        <PaginationComponent
          dotsLength={banners.length}
          activeSlide={activeSlide}
          containerStyle={styles.overlay}
          activeDotStyle={styles.activeDotStyle}
          inactiveDotStyle={styles.inactiveDotStyle}
        />
      </View>
    );
  }

  private renderCarouselItem = (item: any): React.ReactElement => {
    return (
      <Image
        source={{
          uri: item.image_url,
        }}
        style={styles.carouselImage}
      />
    );
  };

  public onSnapToItem = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  public fetchAdvertisementBanners = async (): Promise<void> => {};
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    height: 180,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    flex: 0,
    alignSelf: 'center',
    bottom: 0,
    paddingVertical: 5,
  },
  carouselImage: {
    height: '100%',
    width: '100%',
  },
  activeDotStyle: {
    borderWidth: 1,
  },
  inactiveDotStyle: {
    backgroundColor: theme.colors.darkTint6,
    borderColor: theme.colors.transparent,
  },
});
