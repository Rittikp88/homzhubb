import React from 'react';
import Carousel from 'react-native-snap-carousel';
import { StyleProp, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';

interface ICarouselProps<T> {
  carouselData: T[];
  carouselItem: (item: T) => React.ReactElement;
  activeIndex: number;
  onSnapToItem: (index: number) => void;
  sliderWidth?: number;
  initialNumToRender?: number;
  itemWidth?: number;
  bubbleRef?: (ref: any) => void;
  contentStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

const ACTIVE_SLIDE_OFFSET = 20;

export class SnapCarousel<T> extends React.PureComponent<ICarouselProps<T>> {
  private carouselRef: any;

  public render = (): React.ReactElement => {
    const {
      carouselData,
      activeIndex,
      containerStyle,
      contentStyle,
      testID,
      onSnapToItem,
      initialNumToRender = 10,
      sliderWidth = theme.viewport.width,
      itemWidth = theme.viewport.width - 20,
    } = this.props;
    return (
      <Carousel
        onLayout={this.updateRef}
        data={carouselData}
        firstItem={activeIndex}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        renderItem={this.renderItem}
        activeSlideOffset={ACTIVE_SLIDE_OFFSET}
        onSnapToItem={onSnapToItem}
        contentContainerCustomStyle={contentStyle}
        containerCustomStyle={containerStyle}
        removeClippedSubviews
        initialNumToRender={initialNumToRender}
        ref={(c: any): void => {
          this.carouselRef = c;
        }}
        testID={testID}
      />
    );
  };

  public renderItem = ({ item }: { item: T }): React.ReactElement => {
    const { carouselItem } = this.props;
    return carouselItem(item);
  };

  public updateRef = (): void => {
    const { bubbleRef } = this.props;
    if (bubbleRef) {
      bubbleRef(this.carouselRef);
    }
  };
}
