import React from 'react';
import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { images } from '@homzhub/common/src/assets/images';
import { Label, Text, AssetMetrics, Image } from '@homzhub/common/src/components';
import { Miscellaneous } from '@homzhub/common/src/domain/models/AssetMetrics';

interface IProps {
  assetCount?: number;
  subscription: string;
  data: Miscellaneous[];
  containerStyle?: StyleProp<ViewStyle>;
  isPortfolio?: boolean;
  onPlusIconClicked?: () => void;
}

const AssetMetricsList = (props: IProps): React.ReactElement => {
  const { assetCount = 0, subscription, data, isPortfolio = false, onPlusIconClicked, containerStyle } = props;
  const { t } = useTranslation();

  const renderKeyExtractor = (item: Miscellaneous, index: number): string => {
    return `${item.name}-${index}`;
  };

  const bubblePlusIcon = (): void => {
    if (onPlusIconClicked) {
      onPlusIconClicked();
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.heading}>
        <View style={styles.property}>
          <View style={styles.logo}>
            <Image source={images.homzhubDashboard} />
          </View>
          <View>
            <Text type="regular" textType="bold" style={styles.assetCount}>
              {assetCount}
            </Text>
            <View style={styles.propertiesRow}>
              <Text type="small" textType="semiBold" style={styles.propertyText}>
                {t('common:properties')}
              </Text>
              <Icon name={icons.roundFilled} color={theme.colors.darkTint7} size={6} style={styles.circleIcon} />
              <Label type="large" textType="regular">
                {subscription}
              </Label>
            </View>
          </View>
        </View>
        {isPortfolio && (
          <View style={styles.plusIcon}>
            <Icon name={icons.plus} color={theme.colors.primaryColor} size={40} onPress={bubblePlusIcon} />
          </View>
        )}
      </View>
      <View style={styles.assetMetrics}>
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }: { item: Miscellaneous }): React.ReactElement => {
            const {
              label,
              count,
              colorGradient: { hexColorA, hexColorB, location },
            } = item;
            return (
              <AssetMetrics header={label} value={count} colorA={hexColorA} colorB={hexColorB} location={location} />
            );
          }}
          keyExtractor={renderKeyExtractor}
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
    minHeight: 190,
  },
  heading: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  property: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    paddingVertical: 5,
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
