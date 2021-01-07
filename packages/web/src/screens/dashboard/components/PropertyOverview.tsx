import React, { FC, useEffect, useState } from 'react';
import { ImageStyle, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ButtonGroupProps, CarouselProps } from 'react-multi-carousel';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import HomzhubDashboard from '@homzhub/common/src/assets/images/homzhubDashboard.svg';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { ImageRound } from '@homzhub/common/src/components/atoms/Image';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Hoverable, MultiCarousel, NextPrevBtn } from '@homzhub/web/src/components';
import { Miscellaneous } from '@homzhub/common/src/domain/models/AssetMetrics';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import PopupMenuOptions, { IPopupOptions } from '@homzhub/web/src/components/molecules/PopupMenuOptions';
import Popover from '@homzhub/web/src/components/atoms/Popover';

interface ICardProps {
  data: Miscellaneous;
  isActive: boolean;
  onCardSelect: () => void;
}

interface IProps {
  data: Miscellaneous[];
}

const PropertyOverview: FC<IProps> = ({ data }: IProps) => {
  const [selectedCard, setSelectedCard] = useState('');
  const [detailsOptions, setDetailsOptions] = useState<Miscellaneous[]>([]);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const styles = propertyOverviewStyle(isMobile);
  console.log('here---------------------------------------------');
  console.log(data);
  console.log(detailsOptions);
  const total = detailsOptions?.length ?? 0;
  const updateOptions = (updatedOptions: Miscellaneous[]): void => {
    setDetailsOptions(updatedOptions);
    console.log(updatedOptions);
  };
  useEffect(() => {
    console.log('use effect working');
  }, [detailsOptions]);
  const customCarouselProps: CarouselProps = {
    children: undefined,
    arrows: false,
    draggable: true,
    focusOnSelect: false,
    renderButtonGroupOutside: true,
    customButtonGroup: <CarouselControlsGrp options={detailsOptions} updatedOptions={updateOptions} />,
    responsive: CarouselResponsive,
  };
  useEffect(() => {
    setDetailsOptions(data);
  }, [data]);
  return (
    <View style={styles.container}>
      <EstPortfolioValue />
      {total > 0 ? (
        <View style={styles.carouselContainer}>
          <MultiCarousel passedProps={customCarouselProps}>
            {detailsOptions.map((item: Miscellaneous) => {
              const onCardPress = (): void => setSelectedCard(item.label);
              return (
                <Card key={item.label} data={item} onCardSelect={onCardPress} isActive={selectedCard === item.label} />
              );
            })}
          </MultiCarousel>
        </View>
      ) : null}
    </View>
  );
};

const Card = ({ isActive, onCardSelect, data }: ICardProps): React.ReactElement => {
  const styles = cardStyle(data.colorCode);
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
              {data.count}
            </Typography>
            <Typography
              variant="text"
              size="small"
              fontWeight="regular"
              style={[styles.text, (isHovered || isActive) && styles.activeText]}
            >
              {data.label}
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

interface ICarouselControlsGrp {
  options: Miscellaneous[];
  updatedOptions: (options: Miscellaneous[]) => void;
}

const getPropertyDetailsOptions = (data: Miscellaneous[]): IPopupOptions[] => {
  const settingsOptions: IPopupOptions[] = [];
  data.forEach((option): void => {
    settingsOptions.push({ label: option.label, iconRight: icons.checkboxOff, checked: false });
  });
  return settingsOptions;
};

const CarouselControlsGrp = ({
  next,
  previous,
  options,
  updatedOptions,
}: ICarouselControlsGrp & ButtonGroupProps): React.ReactElement => {
  const { t } = useTranslation();
  const detailsOptions = getPropertyDetailsOptions(options);
  const [settingsOptions, setSettingsOptions] = useState<IPopupOptions[]>(detailsOptions);
  const styles = propertyDetailsControlStyle;
  const updateCarouselIndex = (updateIndexBy: number): void => {
    if (updateIndexBy === 1 && next) {
      next();
    } else if (updateIndexBy === -1 && previous) {
      previous();
    }
  };
  const isMaximumNoOfOptionsSelected = (): boolean => {
    let count = 0;
    const MaximumNoOfAllowedSelection = 3;
    settingsOptions.forEach((item) => {
      if (item.iconRight === icons.checkboxOn) {
        count += 1;
      }
    });
    return count >= MaximumNoOfAllowedSelection;
  };
  const onOptionClick = (selectedOption: IPopupOptions): void => {
    const newOptions: IPopupOptions[] = [];
    settingsOptions.forEach((item) => {
      if (item.label === selectedOption.label) {
        if (isMaximumNoOfOptionsSelected()) {
          if (item.checked) {
            newOptions.push({
              label: selectedOption.label,
              iconRight: icons.checkboxOff,
              checked: false,
            });
          } else {
            newOptions.push(item);
          }
        } else {
          newOptions.push({
            label: selectedOption.label,
            iconRight: !item.checked ? icons.checkboxOn : icons.checkboxOff,
            checked: !item.checked,
          });
        }
      } else {
        newOptions.push(item);
      }
    });
    setSettingsOptions(newOptions);
  };
  const updateOptionsList = (): void => {
    // updating popup options list
    const newOptions: IPopupOptions[] = settingsOptions;
    newOptions.sort((a) => {
      if (a.checked) {
        return -1;
      }
      return 0;
    });
    setSettingsOptions(newOptions);
    // updating the property details options data
    const newUpdatedOptions: Miscellaneous[] = options;
    newUpdatedOptions.sort((a, b) => {
      return (
        newOptions.findIndex((value) => value.label === a.label) -
        newOptions.findIndex((value) => value.label === b.label)
      );
    });
    updatedOptions(newUpdatedOptions);
  };
  return (
    <View style={styles.container}>
      <Typography variant="text" size="small" fontWeight="regular" style={styles.heading}>
        {t('assetPortfolio:propertyDetails')}
      </Typography>
      <Popover
        content={<PopupMenuOptions options={settingsOptions} onMenuOptionPress={onOptionClick} />}
        popupProps={{
          on: 'click',
          closeOnDocumentClick: true,
          modal: true,
          children: undefined,
          onClose: updateOptionsList,
        }}
      >
        <Button
          icon={icons.gearFilled}
          iconSize={16}
          iconColor={theme.colors.blue}
          containerStyle={styles.settings}
          type="secondary"
        />
      </Popover>
      <NextPrevBtn onBtnClick={updateCarouselIndex} />
    </View>
  );
};

// region style
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
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 24,
    border: 'none',
    marginLeft: 8,
    backgroundColor: theme.colors.lightGrayishBlue,
  },
});

interface ICardStyle {
  card: ViewStyle;
  text: ViewStyle;
  activeText: ViewStyle;
  cardActive: ViewStyle;
  roundIcon: ImageStyle;
}

const cardStyle = (activeColor: string): StyleSheet.NamedStyles<ICardStyle> =>
  StyleSheet.create<ICardStyle>({
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
    text: {
      color: theme.colors.darkTint3,
    },
    activeText: {
      color: theme.colors.white,
    },
    cardActive: {
      backgroundColor: activeColor,
      color: theme.colors.white,
    },
    roundIcon: {
      marginRight: 8,
    },
  });

interface IPropertyOverviewStyle {
  container: ViewStyle;
  carouselContainer: ViewStyle;
  heading: ViewStyle;
  portfolioContainer: ViewStyle;
  upArrow: ViewStyle;
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
    upArrow: {
      transform: [{ rotate: '-90deg' }],
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

// endregion

export default PropertyOverview;
