import React from 'react';
import { StyleSheet } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { theme } from '@homzhub/common/src/styles/theme';
import { SVGUri } from '@homzhub/mobile/src/components/atoms/Svg';

interface ICarouselItems {
  screen: string;
  description: string;
  buttonText: string;
  scene: string;
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
          renderItem={this.renderItem}
          activeSlideOffset={20}
          onSnapToItem={this.updateSlideIndex}
          ref={(c: any): void => {
            this.carouselRef = c;
          }}
        />
        {showPagination && this.pagination()}
      </>
    );
  };

  public renderItem = ({ item }: any): React.ReactElement => {
    return <SVGUri width="100%" height="100%" uri={item.scene} />;
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
