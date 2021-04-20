import React, { FC, useState } from 'react';
import { View, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { ButtonGroupProps, CarouselProps } from 'react-multi-carousel';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { ImagePlaceholder } from '@homzhub/common/src/components/atoms/ImagePlaceholder';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import { NextPrevBtn } from '@homzhub/web/src/components';
import { Attachment } from '@homzhub/common/src/domain/models/Attachment';
import { HeroSectionData } from '@homzhub/common/src/constants/LandingScreen';

interface IProps {
  cardImageCarouselStyle: ViewStyle;
  cardImageStyle: ImageStyle;
  imagesArray: Attachment[];
  isListView?: boolean;
}

const defaultResponsive = {
  desktop: {
    breakpoint: {
      max: 3840,
      min: 0,
    },
    items: 1,
    slidesToSlide: 1,
  },
};

const CardImageCarousel: FC<IProps> = ({ cardImageCarouselStyle, cardImageStyle, imagesArray, isListView }: IProps) => {
  return (
    <View style={cardImageCarouselStyle}>
      {imagesArray.length === 0 ? (
        <View>
          <ImagePlaceholder height={isListView ? 230 : 210} />
          <Icon name={icons.heartOutline} size={20} style={styles.favouriteIcon} color={theme.colors.white} />
        </View>
      ) : (
        <MultiCarousel passedProps={carouselProps}>
          {imagesArray.map((item) => (
            <View key={item.id}>
              <Image
                style={[styles.image, cardImageStyle]}
                source={{
                  uri: item.link,
                }}
              />
            </View>
          ))}
        </MultiCarousel>
      )}
    </View>
  );
};

const CarouselButtons = ({ next, previous }: ButtonGroupProps): React.ReactElement => {
  const [currentImage, setCurrentImage] = useState(0);

  const updateCarouselIndex = (updateIndexBy: number): void => {
    if (updateIndexBy === 1 && next) {
      next();
      if (currentImage === HeroSectionData.length - 1) {
        setCurrentImage(0);
      } else {
        setCurrentImage(currentImage + 1);
      }
    } else if (updateIndexBy === -1 && previous) {
      previous();
      if (currentImage === 0) {
        setCurrentImage(HeroSectionData.length - 1);
      } else {
        setCurrentImage(currentImage - 1);
      }
    }
  };

  return (
    <>
      <NextPrevBtn
        leftBtnProps={{
          icon: icons.leftArrow,
          iconSize: 20,
          iconColor: theme.colors.white,
          containerStyle: [styles.leftRightButtons, styles.leftButton],
        }}
        rightBtnProps={{
          icon: icons.rightArrow,
          iconSize: 20,
          iconColor: theme.colors.white,
          containerStyle: [styles.leftRightButtons, styles.rightButton],
        }}
        onBtnClick={updateCarouselIndex}
      />
      <Icon name={icons.heartOutline} size={20} style={styles.favouriteIcon} color={theme.colors.white} />
    </>
  );
};

const carouselProps: CarouselProps = {
  children: undefined,
  arrows: false,
  autoPlay: false,
  draggable: true,
  focusOnSelect: false,
  infinite: true,
  renderButtonGroupOutside: true,
  customButtonGroup: <CarouselButtons />,
  responsive: defaultResponsive,
  showDots: false,
};

export default CardImageCarousel;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  leftRightButtons: {
    borderWidth: 0,
    position: 'absolute',
    width: 'fitContent',
    backgroundColor: theme.colors.transparent,
    top: 100,
  },
  leftButton: {
    left: 0,
  },
  rightButton: {
    right: 0,
  },
  favouriteIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});
