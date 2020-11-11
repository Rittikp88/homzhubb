import React, { useState, useCallback, useRef, useEffect } from 'react';
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import Logo from '@homzhub/common/src/assets/images/homzhubDashboard.svg';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { PaginationComponent } from '@homzhub/mobile/src/components/atoms/PaginationComponent';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { AssetMetrics } from '@homzhub/mobile/src/components/molecules/AssetMetrics';
import { ColorGradient } from '@homzhub/common/src/domain/models/AssetMetrics';

export interface IMetricsData {
  name: string;
  count: string | number;
  label?: string;
  id?: number;
  currencySymbol?: string;
  colorGradient?: ColorGradient;
}

interface IProps {
  data: IMetricsData[];
  title?: string;
  subscription?: string;
  numOfElements?: number;
  onPlusIconClicked?: () => void;
  onMetricsClicked?: (name: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const SLIDER_WIDTH = theme.viewport.width - theme.layout.screenPadding * 4;

const AssetMetricsList = (props: IProps): React.ReactElement => {
  const {
    title = 0,
    subscription,
    data,
    onPlusIconClicked,
    containerStyle,
    onMetricsClicked,
    numOfElements = 3,
    textStyle = {},
  } = props;

  // HOOKS
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const itemWidth = useRef((SLIDER_WIDTH - 12 * (numOfElements - 1)) / numOfElements);
  useEffect(() => {
    itemWidth.current = (SLIDER_WIDTH - 12 * (numOfElements - 1)) / numOfElements;
  }, [numOfElements]);
  // HOOKS END

  // HELPERS
  const bubblePlusIcon = useCallback((): void => {
    if (onPlusIconClicked) {
      onPlusIconClicked();
    }
  }, [onPlusIconClicked]);

  const splitData = useCallback((): IMetricsData[][] => {
    const newArr = [];

    for (let i = 0; i < data.length; i += numOfElements) {
      newArr.push(data.slice(i, i + numOfElements));
    }

    return newArr;
  }, [data, numOfElements]);
  // HELPERS END

  const renderItem = useCallback(
    (items: IMetricsData[]): React.ReactElement => {
      return (
        <View style={styles.sliderRow}>
          {items.map((item: IMetricsData, index: number) => {
            const cardStyle = {
              minWidth: itemWidth.current,
              marginEnd: index === numOfElements - 1 ? 0 : 12,
            };
            const handlePress = (): void => onMetricsClicked && onMetricsClicked(item.name);

            return (
              <AssetMetrics
                key={`${item.label ?? item.name}`}
                header={item.label ?? item.name}
                value={item.count}
                currency={item.currencySymbol ?? ''}
                colorA={item.colorGradient?.hexColorA ?? ''}
                colorB={item.colorGradient?.hexColorB ?? ''}
                location={item.colorGradient?.location ?? []}
                cardStyle={cardStyle}
                angle={item.colorGradient?.angle ?? 0}
                onPressMetrics={handlePress}
                textStyle={textStyle}
              />
            );
          })}
        </View>
      );
    },
    [onMetricsClicked]
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <Logo style={styles.logo} width={48} height={48} />
        <View style={styles.headerCenter}>
          <Text type="regular" textType="bold" style={styles.assetCount}>
            {title}
          </Text>
          <View style={styles.propertiesRow}>
            <Text type="small" textType="semiBold" style={styles.propertyText}>
              {t('common:properties')}
            </Text>
            {subscription && (
              <>
                <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={8} style={styles.circleIcon} />
                <Label type="large" textType="regular">
                  {`${t('common:homzhub')} ${subscription}`}
                </Label>
              </>
            )}
          </View>
        </View>
        {onPlusIconClicked && (
          <Icon
            name={icons.plus}
            size={32}
            color={theme.colors.primaryColor}
            onPress={bubblePlusIcon}
            testID="icnPlus"
          />
        )}
      </View>
      <SnapCarousel
        carouselData={splitData()}
        carouselItem={renderItem}
        activeIndex={activeIndex}
        onSnapToItem={setActiveIndex}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={SLIDER_WIDTH}
      />
      <PaginationComponent
        dotsLength={splitData().length}
        activeSlide={activeIndex}
        containerStyle={styles.paginationContainer}
        activeDotStyle={[styles.dot, styles.activeDot]}
        inactiveDotStyle={[styles.dot, styles.inactiveDot]}
      />
    </View>
  );
};

const memoizedComponent = React.memo(AssetMetricsList);
export { memoizedComponent as AssetMetricsList };

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: theme.layout.screenPadding,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerCenter: {
    flex: 1,
  },
  propertiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderRow: {
    flexDirection: 'row',
  },
  paginationContainer: {
    paddingVertical: 0,
    marginTop: 12,
  },
  assetCount: {
    color: theme.colors.darkTint1,
  },
  propertyText: {
    color: theme.colors.darkTint4,
  },
  circleIcon: {
    paddingTop: 4,
    paddingHorizontal: 6,
  },
  logo: {
    marginEnd: 12,
  },
  dot: {
    width: 8.5,
    height: 8.5,
  },
  activeDot: {
    borderWidth: 1.5,
  },
  inactiveDot: {
    backgroundColor: theme.colors.disabled,
    borderWidth: 0,
  },
});
