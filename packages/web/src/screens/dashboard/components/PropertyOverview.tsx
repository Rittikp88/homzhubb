import React, { FC, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ButtonGroupProps, CarouselProps } from 'react-multi-carousel';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import HomzhubDashboard from '@homzhub/common/src/assets/images/homzhubDashboard.svg';
import { ImageRound } from '@homzhub/common/src/components/atoms/Image';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { MultiCarousel, NextPrevBtn } from '@homzhub/web/src/components';

interface ICardProps {
  isActive: boolean;
  onCardSelect: () => void;
}

// todo :(bishal) replace dummy data
const PropertyOverview: FC = () => {
  const dummyData = [1, 2, 3, 4, 5, 6, 7];
  const [selectedCard, setSelectedCard] = useState(0);
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
  return (
    <TouchableOpacity activeOpacity={100} onPress={onCardSelect} style={[styles.card, isActive && styles.cardActive]}>
      <ImageRound
        style={styles.roundIcon}
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
          style={[styles.text, isActive && styles.activeText]}
        >
          50
        </Typography>
        <Typography
          variant="text"
          size="small"
          fontWeight="regular"
          style={[styles.text, isActive && styles.activeText]}
        >
          Occupied
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

const EstPortfolioValue: FC = () => {
  // fixme: (bishal) - .svg files typescript not working for web
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const logo = <HomzhubDashboard width={61} height={64} />;
  return (
    <View style={styles.portfolioContainer}>
      <Typography variant="text" size="small" fontWeight="regular" style={styles.heading}>
        Est. Portfolio Value
      </Typography>
      <View style={styles.propertiesValueWrapper}>
        {logo}
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

const defaultResponsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1200 },
    items: 3,
    slidesToSlide: 1,
  },
  desktop: {
    breakpoint: { max: 1200, min: 1024 },
    items: 3,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 800, min: 0 },
    items: 2,
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
  return (
    <View style={styles.propertyDetails}>
      <Typography variant="text" size="small" fontWeight="regular" style={styles.propertyDetailsHeading}>
        Property Details
      </Typography>
      <Icon name={icons.setting} size={16} color={theme.colors.blue} style={styles.settings} />
      <NextPrevBtn onBtnClick={updateCarouselIndex} />
    </View>
  );
};

const customCarouselProps: CarouselProps = {
  children: undefined,
  arrows: false,
  draggable: true,
  focusOnSelect: false,
  renderButtonGroupOutside: true,
  customButtonGroup: <CarouselControlsGrp />,
  responsive: defaultResponsive,
};

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: theme.colors.white,
  },
  settings: {
    marginHorizontal: 16,
  },
  propertyDetailsHeading: {
    flex: 1,
    color: theme.colors.darkTint1,
  },
  carouselContainer: {
    width: '55%',
    flexDirection: 'column-reverse',
  },
  heading: {
    color: theme.colors.darkTint1,
  },
  propertyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  portfolioContainer: {
    height: '100%',
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
