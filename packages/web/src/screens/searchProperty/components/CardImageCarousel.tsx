import React, { FC, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { HeroSectionData } from '@homzhub/common/src/constants/LandingScreen';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import { ButtonGroupProps, CarouselProps } from 'react-multi-carousel';
import { Image } from '@homzhub/common/src/components/atoms/Image';
import { useDown, useIsIpadPro, useViewPort } from '@homzhub/common/src/utils/MediaQueryUtils';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { NextPrevBtn } from '@homzhub/web/src/components';

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
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isIpadPro = useIsIpadPro();

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

const ChangeImage = ({ next, previous }: ButtonGroupProps): React.ReactElement => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const updateCarouselIndex = (updateIndexBy: number): void => {
    if (updateIndexBy === 1 && next) {
      next();
      if (currentSlide === HeroSectionData.length - 1) {
        setCurrentSlide(0);
      } else {
        setCurrentSlide(currentSlide + 1);
      }
    } else if (updateIndexBy === -1 && previous) {
      previous();
      if (currentSlide === 0) {
        setCurrentSlide(HeroSectionData.length - 1);
      } else {
        setCurrentSlide(currentSlide - 1);
      }
    }
  };

  return (
    <>
      {/* <Button
        type="secondary"
        containerStyle={[styles.leftRightButtons, styles.leftButton]}
        onPress={updateCarouselIndex}
      >
        <Icon name={icons.leftArrow} size={36} />
      </Button>
      <Button type="secondary" containerStyle={[styles.leftRightButtons, styles.rightButton]}>
        <Icon name={icons.rightArrow} size={36} />
      </Button> */}
      <NextPrevBtn
        leftBtnProps={{
          icon: icons.leftArrow,
          iconSize: 20,
          containerStyle: [styles.leftRightButtons, styles.leftButton],
        }}
        rightBtnProps={{
          icon: icons.rightArrow,
          iconSize: 20,
          containerStyle: [styles.leftRightButtons, styles.rightButton],
        }}
        onBtnClick={updateCarouselIndex}
      />
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
  customButtonGroup: <ChangeImage />,
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
  },
  leftButton: {},
  rightButton: {},
});
