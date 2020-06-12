import React from 'react';
import Carousel from 'react-native-snap-carousel';
import { StyleProp, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';

interface ICarouselProps<T> {
  carouselData: T[];
  carouselItem: (item: T) => React.ReactElement;
  activeSlide: number;
  currentSlide: (index: number) => void;
  bubbleRef: (ref: any) => void;
  contentStyle?: StyleProp<ViewStyle>;
}

export class SnapCarousel<T> extends React.PureComponent<ICarouselProps<T>> {
  private carouselRef: any;

  public render = (): React.ReactElement => {
    const { carouselData, activeSlide, contentStyle } = this.props;
    return (
      <Carousel
        onLayout={this.updateRef}
        data={carouselData}
        firstItem={activeSlide}
        sliderWidth={theme.viewport.width}
        itemWidth={theme.viewport.width - 20}
        renderItem={this.renderItem}
        activeSlideOffset={20}
        onSnapToItem={this.updateSlideIndex}
        contentContainerCustomStyle={contentStyle}
        ref={(c: any): void => {
          this.carouselRef = c;
        }}
      />
    );
  };

  public renderItem = ({ item }: { item: T }): React.ReactElement => {
    const { carouselItem } = this.props;
    return carouselItem(item);
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
