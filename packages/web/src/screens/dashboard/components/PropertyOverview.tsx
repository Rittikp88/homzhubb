import React, { FC, useState } from 'react';
import { ImageStyle, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ButtonGroupProps, CarouselProps } from 'react-multi-carousel';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import HomzhubDashboard from '@homzhub/common/src/assets/images/homzhubDashboard.svg';
import { ImageRound } from '@homzhub/common/src/components/atoms/Image';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Hoverable, MultiCarousel, NextPrevBtn } from '@homzhub/web/src/components';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface ICardProps {
  isActive: boolean;
  onCardSelect: () => void;
}

// todo :(bishal) replace dummy data
const PropertyOverview: FC = () => {
  const dummyData = [1, 2, 3, 4, 5, 6, 7];
  const [selectedCard, setSelectedCard] = useState(0);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = propertyOverviewStyle(isMobile);
  return (
    <View style={styles.container}>
      <EstPortfolioValue />
      <View style={styles.carouselContainer}>
        <MultiCarousel passedProps={customCarouselProps}>
          {dummyData.map((value: number) => {
            const onCardPress = (): void => setSelectedCard(value);
            return <Card key={value} onCardSelect={onCardPress} isActive={selectedCard === value} />;
          })}
        </MultiCarousel>
      </View>
    </View>
  );
};

const Card = ({ isActive, onCardSelect }: ICardProps): React.ReactElement => {
  const styles = propertyOverviewStyle();
  return (
    <Hoverable>
      {(isHovered: boolean): React.ReactNode => (
        <TouchableOpacity
          activeOpacity={100}
          onPress={onCardSelect}
          style={[styles.card, (isHovered || isActive) && styles.cardActive]}
        >
          <ImageRound
            style={styles.roundIcon as ImageStyle}
            size={54}
            source={{
              uri:
                'https://cdn57.androidauthority.net/wp-content/uploads/2020/04/oneplus-8-pro-ultra-wide-sample-twitter-1.jpg',
            }}
          />
          <View>
            <Typography
              variant="text"
              size="large"
              fontWeight="semiBold"
              style={[styles.text, (isHovered || isActive) && styles.activeText]}
            >
              50
            </Typography>
            <Typography
              variant="text"
              size="small"
              fontWeight="regular"
              style={[styles.text, (isHovered || isActive) && styles.activeText]}
            >
              Occupied
            </Typography>
          </View>
        </TouchableOpacity>
      )}
    </Hoverable>
  );
};

const EstPortfolioValue: FC = () => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = propertyOverviewStyle(isMobile);
  return (
    <View style={styles.portfolioContainer}>
      <Typography variant="text" size="small" fontWeight="regular" style={styles.heading}>
        Est. Portfolio Value
      </Typography>
      <View style={styles.propertiesValueWrapper}>
        <HomzhubDashboard width={61} height={64} />
        <View style={styles.propertiesValueContainer}>
          <Typography variant="text" size="regular" fontWeight="semiBold" style={styles.valuation}>
            &#x20B9; 50 Lacs
          </Typography>
          <View style={styles.valueContainer}>
            <Icon name={icons.dart} size={16} color={theme.colors.lightGreen} style={styles.upArrow} />
            <Typography variant="label" size="large" fontWeight="semiBold" style={styles.valueChange}>
              5%
            </Typography>
            <Typography variant="label" size="regular" fontWeight="semiBold" style={styles.valueChangeTime}>
              Since last week
            </Typography>
          </View>
        </View>
      </View>
    </View>
  );
};

const CarouselResponsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1304 },
    items: 3,
    slidesToSlide: 1,
  },
  desktop: {
    breakpoint: { max: 1303, min: 1248 },
    items: 3,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1248, min: 768 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const CarouselControlsGrp = ({ next, previous }: ButtonGroupProps): React.ReactElement => {
  const updateCarouselIndex = (updateIndexBy: number): void => {
    if (updateIndexBy === 1 && next) {
      next();
    } else if (updateIndexBy === -1 && previous) {
      previous();
    }
  };
  const styles = propertyDetailsControlStyle;
  return (
    <View style={styles.container}>
      <Typography variant="text" size="small" fontWeight="regular" style={styles.heading}>
        Property Details
      </Typography>
      <Icon name={icons.setting} size={16} color={theme.colors.blue} style={styles.settings} />
      <NextPrevBtn onBtnClick={updateCarouselIndex} />
    </View>
  );
};

const propertyDetailsControlStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 8,
  },
  heading: {
    flex: 1,
    color: theme.colors.darkTint1,
  },
  settings: {
    marginHorizontal: 16,
  },
});

const customCarouselProps: CarouselProps = {
  children: undefined,
  arrows: false,
  draggable: true,
  focusOnSelect: false,
  renderButtonGroupOutside: true,
  customButtonGroup: <CarouselControlsGrp />,
  responsive: CarouselResponsive,
};

interface IPropertyOverviewStyle {
  container: ViewStyle;
  carouselContainer: ViewStyle;
  heading: ViewStyle;
  portfolioContainer: ViewStyle;
  card: ViewStyle;
  upArrow: ViewStyle;
  text: ViewStyle;
  activeText: ViewStyle;
  cardActive: ViewStyle;
  roundIcon: ViewStyle;
  propertiesValueWrapper: ViewStyle;
  propertiesValueContainer: ViewStyle;
  valueContainer: ViewStyle;
  valuation: ViewStyle;
  valueChange: ViewStyle;
  valueChangeTime: ViewStyle;
}

const propertyOverviewStyle = (isMobile?: boolean): StyleSheet.NamedStyles<IPropertyOverviewStyle> =>
  StyleSheet.create<IPropertyOverviewStyle>({
    container: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 8,
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      borderRadius: 4,
      backgroundColor: theme.colors.white,
    },
    carouselContainer: {
      width: isMobile ? '100%' : '55%',
      marginTop: isMobile ? 24 : undefined,
      flexDirection: 'column-reverse',
    },
    heading: {
      color: theme.colors.darkTint1,
    },
    portfolioContainer: {
      flex: 1,
      height: isMobile ? undefined : '100%',
    },
    card: {
      alignItems: 'center',
      flexDirection: 'row',
      margin: 8,
      justifyContent: 'center',
      minHeight: 72,
      borderRadius: 4,
      shadowOpacity: 0.08,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowRadius: 8,
      shadowColor: theme.colors.shadow,
      backgroundColor: theme.colors.white,
    },
    upArrow: {
      transform: [{ rotate: '-90deg' }],
    },
    text: {
      color: theme.colors.darkTint3,
    },
    activeText: {
      color: theme.colors.white,
    },
    cardActive: {
      backgroundColor: theme.colors.lightGreen,
      color: theme.colors.white,
    },
    roundIcon: {
      marginRight: 8,
    },
    propertiesValueWrapper: {
      flexDirection: 'row',
      marginVertical: 'auto',
    },
    propertiesValueContainer: {
      marginLeft: 8,
      justifyContent: 'space-evenly',
    },
    valueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    valuation: {
      color: theme.colors.primaryColor,
    },
    valueChange: {
      color: theme.colors.lightGreen,
      marginRight: 8,
    },
    valueChangeTime: {
      color: theme.colors.darkTint6,
    },
  });

export default PropertyOverview;
