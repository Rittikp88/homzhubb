import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { PaginationComponent } from '@homzhub/mobile/src/components/atoms/PaginationComponent';
import { AssetAdvertisement, AssetAdvertisementResults } from '@homzhub/common/src/domain/models/AssetAdvertisement';

interface IAssetAdvertisementBannerState {
  banners: AssetAdvertisement;
  activeSlide: number;
}

const ITEM_WIDTH = theme.viewport.width - theme.layout.screenPadding * 2;
export class AssetAdvertisementBanner extends React.PureComponent<{}, IAssetAdvertisementBannerState> {
  public state = {
    banners: {} as AssetAdvertisement,
    activeSlide: 0,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.fetchAdvertisementBanners();
  };

  public render(): React.ReactNode {
    const { banners, activeSlide } = this.state;
    if (!banners) {
      return null;
    }
    return (
      <View style={styles.container}>
        <SnapCarousel
          carouselData={banners?.results ?? []}
          carouselItem={this.renderCarouselItem}
          sliderWidth={ITEM_WIDTH}
          itemWidth={ITEM_WIDTH}
          activeIndex={activeSlide}
          containerStyle={styles.radius}
          onSnapToItem={this.onSnapToItem}
          testID="bannerSnap"
        />
        <PaginationComponent
          dotsLength={banners?.results?.length ?? 0}
          activeSlide={activeSlide}
          containerStyle={styles.overlay}
          activeDotStyle={styles.activeDotStyle}
          inactiveDotStyle={styles.inactiveDotStyle}
        />
      </View>
    );
  }

  private renderCarouselItem = (item: AssetAdvertisementResults): React.ReactElement => {
    return (
      <Image
        source={{
          uri: item.attachment.link,
        }}
        style={styles.carouselImage}
      />
    );
  };

  public onSnapToItem = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
  };

  public fetchAdvertisementBanners = async (): Promise<void> => {
    const response: AssetAdvertisement = await DashboardRepository.getAdvertisements();
    this.setState({ banners: response });
  };
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    height: 180,
  },
  radius: {
    borderRadius: 4,
  },
  overlay: {
    position: 'absolute',
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
