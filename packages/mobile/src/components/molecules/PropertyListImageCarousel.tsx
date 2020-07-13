import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Favorite, SVGUri } from '@homzhub/common/src/components';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';

interface IProps {
  data: any;
  isFavorite: boolean;
  onFavorite: () => void;
}

interface IPropertyListImageCarouselState {
  ref: any;
  activeSlide: number;
}

class PropertyListImageCarousel extends React.PureComponent<IProps, IPropertyListImageCarouselState> {
  public state = {
    activeSlide: 0,
    ref: null,
  };

  public render(): React.ReactElement {
    const { data, isFavorite, onFavorite } = this.props;
    const { activeSlide } = this.state;
    return (
      <View style={styles.carouselContainer}>
        <SnapCarousel
          bubbleRef={this.updateRef}
          carouselData={data}
          carouselItem={this.renderCarouselItem}
          activeSlide={activeSlide}
          currentSlide={this.changeSlide}
        />
        <View style={styles.overlay}>
          <View style={styles.favoriteContainer}>
            <Favorite isFavorite={isFavorite} onFavorite={onFavorite} />
          </View>
          <View style={styles.arrowContainer}>
            <Icon
              name={icons.map}
              size={50}
              color={activeSlide === 0 ? theme.colors.darkTint10 : theme.colors.shadow}
              onPress={this.previousSlide}
            />
            <Icon
              name={icons.star}
              size={50}
              color={activeSlide === data.length - 1 ? theme.colors.darkTint10 : theme.colors.shadow}
              onPress={this.nextSlide}
            />
          </View>
        </View>
      </View>
    );
  }

  private renderCarouselItem = (item: any): React.ReactElement => {
    return <SVGUri viewBox="0 10 360 220" uri={item.image_url} />;
  };

  public updateRef = (ref: any): void => {
    this.setState({ ref });
  };

  public changeSlide = (slideNumber: number): void => {
    this.setState({ activeSlide: slideNumber });
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

export default PropertyListImageCarousel;

const styles = StyleSheet.create({
  carouselContainer: {
    position: 'relative',
    borderRadius: 4,
    height: 250,
    borderColor: theme.colors.darkTint5,
    borderWidth: 1,
  },
  favoriteContainer: {
    flexDirection: 'row-reverse',
    margin: 15,
  },
  arrowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 8,
    marginVertical: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
