import React from 'react';
import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { images } from '@homzhub/common/src/assets/images';
import { Label, Text, AssetMetrics, Image } from '@homzhub/common/src/components';
import { ColorGradient } from '@homzhub/common/src/domain/models/AssetMetrics';

interface IMetricsData {
  name: string;
  count: number;
  label?: string;
  id?: number;
  currencySymbol?: string;
  colorGradient?: ColorGradient;
}

interface IProps {
  title?: number | string;
  subscription?: string;
  data: IMetricsData[];
  containerStyle?: StyleProp<ViewStyle>;
  showPlusIcon?: boolean;
  onPlusIconClicked?: () => void;
  individualCardStyle?: StyleProp<ViewStyle>;
}

const AssetMetricsList = (props: IProps): React.ReactElement => {
  const {
    title = 0,
    subscription,
    data,
    showPlusIcon = false,
    onPlusIconClicked,
    containerStyle,
    individualCardStyle,
  } = props;
  const { t } = useTranslation();

  const renderKeyExtractor = (item: IMetricsData, index: number): string => {
    return `${item.name}-${index}`;
  };

  const bubblePlusIcon = (): void => {
    if (onPlusIconClicked) {
      onPlusIconClicked();
    }
  };

  const renderItem = ({ item }: { item: IMetricsData }): React.ReactElement => {
    return (
      <AssetMetrics
        header={item.label ?? item.name}
        value={item.count}
        currency={item.currencySymbol ?? ''}
        colorA={item.colorGradient?.hexColorA ?? ''}
        colorB={item.colorGradient?.hexColorB ?? ''}
        location={item.colorGradient?.location ?? []}
        cardStyle={individualCardStyle}
        angle={item.colorGradient?.angle ?? 0}
      />
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.property}>
        <View style={styles.logo}>
          <Image source={images.homzhubDashboard} />
        </View>
        <View style={styles.content}>
          <View style={styles.topView}>
            <Text type="regular" textType="bold" style={styles.assetCount}>
              {title}
            </Text>
            {showPlusIcon && (
              <View style={styles.plusIcon}>
                <Icon
                  name={icons.plus}
                  color={theme.colors.primaryColor}
                  size={40}
                  onPress={bubblePlusIcon}
                  testID="icnPlus"
                />
              </View>
            )}
          </View>
          {subscription && (
            <View style={styles.propertiesRow}>
              <Text type="small" textType="semiBold" style={styles.propertyText}>
                {t('common:properties')}
              </Text>
              <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={6} style={styles.circleIcon} />
              <Label type="large" textType="regular">
                {`${t('common:homzhub')} ${subscription}`}
              </Label>
            </View>
          )}
        </View>
      </View>
      <View style={styles.assetMetrics}>
        <FlatList<IMetricsData>
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={renderKeyExtractor}
          testID="metricList"
        />
      </View>
    </View>
  );
};

export { AssetMetricsList };

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    minHeight: 80,
  },
  property: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  logo: {
    flex: 0,
    paddingHorizontal: 15,
  },
  assetCount: {
    color: theme.colors.darkTint1,
  },
  propertyText: {
    color: theme.colors.darkTint4,
  },
  assetMetrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  plusIcon: {
    backgroundColor: theme.colors.lightGrayishBlue,
    marginRight: 12,
  },
  propertiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleIcon: {
    paddingHorizontal: 8,
    paddingTop: 5,
  },
});
