import React from 'react';
import { View, StyleSheet } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { ImageSquare } from '@homzhub/common/src/components';
import { theme } from '@homzhub/common/src/styles/theme';

interface ICarouselItems {
  screen: string;
  description: string;
  buttonText: string;
  scene: any;
}

interface ICarouselProps {
  carouselItems: Array<ICarouselItems>;
  activeSlide: number;
  showPagination: boolean;
  currentSlide: (index: number) => void;
  bubbleRef: (ref: any) => void;
}

export class SnapCarousel extends React.PureComponent<ICarouselProps, {}> {
  private carouselRef: any;

  public render = (): React.ReactElement => {
    const { carouselItems, showPagination } = this.props;
    return (
      <>
        <Carousel
          onLayout={this.updateRef}
          data={carouselItems}
          sliderWidth={theme.viewport.width}
          itemWidth={theme.viewport.width}
          slideStyle={{ width: theme.viewport.width }}
          renderItem={this.renderItem}
          activeSlideOffset={20}
          onSnapToItem={this.updateSlideIndex}
          ref={(c: any) => {
            this.carouselRef = c;
          }}
        />
        {showPagination && this.pagination()}
      </>
    );
  };

  public renderItem = ({ item }: any): React.ReactElement => {
    return (
      <View style={styles.container}>
        <ImageSquare size={theme.viewport.width} source={item.scene} style={styles.image} />
      </View>
    );
  };

  public pagination = (): React.ReactElement => {
    const { carouselItems, activeSlide } = this.props;
    return (
      <Pagination
        dotsLength={carouselItems.length}
        activeDotIndex={activeSlide}
        dotStyle={styles.dotStyle}
        inactiveDotStyle={styles.inactiveDotStyle}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    );
  };

  public updateSlideIndex = (index: number): void => {
    const { currentSlide } = this.props;
    currentSlide(index);
  };

  public updateRef = (): void => {
    const { bubbleRef } = this.props;
    bubbleRef(this.carouselRef);
  };
}

const styles = StyleSheet.create({
  container: {
    height: theme.viewport.height / 3,
  },
  image: {
    width: theme.viewport.width / 2,
    height: theme.viewport.width / 3,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
    borderColor: theme.colors.blue,
    borderStyle: 'solid',
    borderWidth: 3,
    backgroundColor: theme.colors.white,
  },
  inactiveDotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
    backgroundColor: theme.colors.blue,
  },
});
