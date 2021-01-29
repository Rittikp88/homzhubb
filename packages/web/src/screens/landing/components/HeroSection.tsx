import React, { FC, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ButtonGroupProps, CarouselProps } from 'react-multi-carousel';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { ImageSquare } from '@homzhub/common/src/components/atoms/Image';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import { NextPrevBtn } from '@homzhub/web/src/components';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
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

// todo remove dummy image
const HeroSection: FC = () => {
  const isTablet = useDown(deviceBreakpoint.TABLET);
  let scrollLength = 0;
  const onLayout = (e: LayoutChangeEvent): void => {
    scrollLength = e.nativeEvent.layout.height;
  };
  const onScrollDownPress = (): void => {
    window.scrollTo({
      top: scrollLength,
      left: 0,
      behavior: 'smooth',
    });
  };

  const gradientViewStyles = {
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(180deg, 
      ${theme.colors.landingCarouselGradientA} 0%,
      ${theme.colors.landingCarouselGradientB} 80.21%)`,
  };

  return (
    <View onLayout={onLayout} style={styles.container}>
      <MultiCarousel passedProps={carouselProps}>
        {HeroSectionData.map((item) => (
          <View key={item.title}>
            <ImageSquare
              style={styles.image}
              size={50}
              source={{
                uri: item.image,
              }}
            />
            <div style={gradientViewStyles} />
          </View>
        ))}
      </MultiCarousel>
      {!isTablet && (
        <TouchableOpacity style={styles.downToggle} onPress={onScrollDownPress}>
          <Icon name={icons.scrollDown} size={36} color={theme.colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const CarouselControlSection = ({ next, previous }: ButtonGroupProps): React.ReactElement => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
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
    <View style={[styles.slideInfo, isMobile && styles.slideInfoMobile]}>
      <View>
        <Typography
          variant="title"
          size="large"
          fontWeight="bold"
          style={[styles.title, isMobile && styles.centerText]}
        >
          {HeroSectionData[currentSlide].title}
        </Typography>
        <Typography
          variant="text"
          size="regular"
          fontWeight="regular"
          style={[styles.description, isMobile && styles.centerText]}
        >
          {HeroSectionData[currentSlide].description}
        </Typography>
      </View>
      <View style={styles.arrow}>
        <NextPrevBtn
          leftBtnProps={{
            icon: icons.longArrowLeft,
            iconSize: 20,
            iconColor: theme.colors.white,
            containerStyle: styles.icon,
          }}
          rightBtnProps={{
            icon: icons.longArrowRight,
            iconSize: 20,
            iconColor: theme.colors.white,
            containerStyle: styles.icon,
          }}
          onBtnClick={updateCarouselIndex}
        />
      </View>
    </View>
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
  customButtonGroup: <CarouselControlSection />,
  responsive: defaultResponsive,
  showDots: false,
};

export default HeroSection;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: 60,
  },
  image: {
    flex: 1,
    position: 'relative',
    minWidth: '100%',
    minHeight: '86vh',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  slideInfo: {
    position: 'absolute',
    marginTop: '25%',
    alignSelf: 'center',
    width: '90%',
    height: 'fit-content',
  },
  slideInfoMobile: {
    marginTop: '8vh',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '75vh',
  },
  title: {
    color: theme.colors.white,
  },
  centerText: {
    textAlign: 'center',
  },
  description: {
    color: theme.colors.white,
  },
  arrow: {
    flexDirection: 'row',
  },
  arrowMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 30,
    justifyContent: 'center',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 24,
    border: 'none',
    backgroundColor: theme.colors.transparent,
    marginRight: 30,
    marginVertical: 20,
  },
  downToggle: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '20px',
  },
});
