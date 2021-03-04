import React, { FC, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ButtonGroupProps, CarouselProps } from 'react-multi-carousel';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import { NextPrevBtn } from '@homzhub/web/src/components';
import { HeroSectionData } from '@homzhub/common/src/constants/LandingScreen';

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

const CardImageCarousel: FC = () => {
  // TODO Charit: Replace the images and label sources with props after integration.
  return (
    <View style={styles.cardImageCrousel}>
      <MultiCarousel passedProps={carouselProps}>
        {HeroSectionData.map((item) => (
          <View key={item.title}>
            <Image
              style={[styles.image]}
              source={{
                uri: item.image,
              }}
            />
          </View>
        ))}
      </MultiCarousel>
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
      <View style={styles.propertyHighlightLabelContainer}>
        <Typography variant="label" size="regular" style={styles.propertyHighlightLabel}>
          Description - From API
        </Typography>
      </View>
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
  cardImageCrousel: {
    width: 340,
    height: 210,
  },
  image: {
    flex: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    width: 340,
    height: 210,
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
  propertyHighlightLabelContainer: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    borderRadius: 2,
    backgroundColor: theme.colors.imageVideoPaginationBackground,
  },
  propertyHighlightLabel: {
    color: theme.colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
