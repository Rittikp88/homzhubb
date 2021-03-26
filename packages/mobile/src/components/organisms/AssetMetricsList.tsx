import React, { useState, useCallback } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import Logo from '@homzhub/common/src/assets/images/homzhubDashboard.svg';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { PaginationComponent } from '@homzhub/mobile/src/components/atoms/PaginationComponent';
import { SnapCarousel } from '@homzhub/mobile/src/components/atoms/Carousel';
import { AssetMetrics } from '@homzhub/mobile/src/components/molecules/AssetMetrics';

export interface IMetricsData {
  name: string;
  count: string | number;
  label?: string;
  id?: number;
  isCurrency?: boolean;
  colorCode: string;
}

interface IProps {
  data: IMetricsData[];
  title?: string;
  subscription?: string;
  selectedAssetType?: string;
  numOfElements?: number;
  isSubTextRequired?: boolean;
  onPlusIconClicked?: () => void;
  onMetricsClicked?: (name: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  subTitleText?: string;
  headerIcon?: string;
}

const COMPONENT_PADDING = 12;
const SLIDER_WIDTH = theme.viewport.width - theme.layout.screenPadding * 2;
const AssetMetricsList = (props: IProps): React.ReactElement => {
  const {
    title = 0,
    subscription,
    data,
    selectedAssetType,
    onPlusIconClicked,
    containerStyle,
    onMetricsClicked,
    numOfElements = 3,
    isSubTextRequired = true,
    subTitleText,
    headerIcon,
  } = props;

  // HOOKS
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
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
          {items.map((item: IMetricsData) => {
            const cardStyle = {
              minWidth: (SLIDER_WIDTH - COMPONENT_PADDING * (numOfElements + 1)) / numOfElements,
            };
            const handlePress = (): void => onMetricsClicked && onMetricsClicked(item.name);
            return (
              <AssetMetrics
                key={`${item.label ?? item.name}`}
                header={item.label ?? item.name}
                value={item.count}
                isCurrency={item.isCurrency ?? false}
                cardStyle={cardStyle}
                colorCode={item.colorCode}
                onPressMetrics={handlePress}
                selectedAssetType={selectedAssetType}
              />
            );
          })}
        </View>
      );
    },
    [onMetricsClicked, numOfElements, selectedAssetType]
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.header, !isSubTextRequired && styles.financialView]}>
        {headerIcon ? (
          <View>
            <Icon name={headerIcon} size={30} style={styles.icon} color={theme.colors.blue} />
            <View style={[styles.headerIcon, styles.logo]} />
          </View>
        ) : (
          <Logo style={styles.logo} width={50} height={50} />
        )}
        <View style={styles.headerCenter}>
          <Text type="regular" textType="bold" style={styles.assetCount}>
            {title}
          </Text>
          <View style={styles.propertiesRow}>
            {isSubTextRequired && (
              <Label type="large" textType="semiBold" style={styles.propertyText}>
                {subTitleText || t('common:properties')}
              </Label>
            )}
            {subscription && (
              <>
                <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={8} style={styles.circleIcon} />
                <Label type="regular" textType="regular" style={styles.textStyle}>
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
    borderRadius: 4,
    backgroundColor: theme.colors.white,
  },
  header: {
    marginHorizontal: 12,
    flexDirection: 'row',
  },
  headerCenter: {
    flex: 1,
  },
  propertiesRow: {
    flexDirection: 'row',
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
    paddingTop: 10,
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
  financialView: {
    alignItems: 'center',
  },
  textStyle: {
    marginTop: 2,
    width: theme.viewport.width < 350 ? theme.viewport.width / 2 - 48 : undefined,
  },
  headerIcon: {
    backgroundColor: theme.colors.blue,
    width: 50,
    height: 50,
    opacity: 0.1,
    borderRadius: 30,
  },
  icon: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
});
