import React from 'react';
import { View, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, FlatList } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Image, ImageVideoPagination, YoutubeVideo } from '@homzhub/common/src/components';

interface IProps {
  activeSlide: number;
  data: any[];
  onFullScreenToggle: () => void;
  updateSlide: (index: number) => void;
}

export class FullScreenAssetDetailsCarousel extends React.PureComponent<IProps> {
  public render(): React.ReactElement {
    return (
      <View style={styles.fullscreen}>
        {this.renderListHeader()}
        {this.renderImageAndVideo()}
      </View>
    );
  }

  public renderListHeader = (): React.ReactElement => {
    const { activeSlide, data, onFullScreenToggle } = this.props;
    return (
      <View style={styles.fullscreenContainer}>
        <Icon name={icons.close} size={20} color={theme.colors.white} onPress={onFullScreenToggle} />
        <ImageVideoPagination
          currentSlide={activeSlide}
          totalSlides={data.length}
          // @ts-ignore
          type={data[activeSlide].attachment_type}
        />
        <Icon name={icons.star} size={40} color={theme.colors.white} onPress={onFullScreenToggle} />
      </View>
    );
  };

  public renderImageAndVideo = (): React.ReactElement => {
    const { activeSlide, data, updateSlide } = this.props;
    const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
      const pageNumber =
        Math.min(Math.max(Math.floor(e.nativeEvent.contentOffset.x / theme.viewport.width + 0.5) + 1, 0), data.length) -
        1;
      updateSlide(pageNumber);
    };
    return (
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={this.renderItem}
        onMomentumScrollEnd={onScrollEnd}
        keyExtractor={this.renderKeyExtractor}
        removeClippedSubviews
        initialScrollIndex={activeSlide}
      />
    );
  };

  public renderItem = (item: any): React.ReactElement => {
    const { onFullScreenToggle } = this.props;
    const {
      item: { link, attachment_type },
    } = item;
    if (attachment_type === 'IMAGE') {
      return (
        <ImageZoom
          cropWidth={theme.viewport.width}
          cropHeight={theme.viewport.height}
          imageWidth={theme.viewport.width}
          imageHeight={500}
          enableSwipeDown
          onSwipeDown={onFullScreenToggle}
          key={link}
        >
          <Image source={{ uri: link }} style={styles.carouselImage} />
        </ImageZoom>
      );
    }
    return <YoutubeVideo url={link} play key={link} />;
  };

  private renderKeyExtractor = (item: any, index: number): string => {
    return `${item}-${index}`;
  };
}

const styles = StyleSheet.create({
  fullscreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    backgroundColor: theme.colors.darkTint1,
  },
  fullscreenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    margin: theme.layout.screenPadding,
  },
  carouselImage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: theme.viewport.height / 2,
    width: theme.viewport.width,
  },
});
