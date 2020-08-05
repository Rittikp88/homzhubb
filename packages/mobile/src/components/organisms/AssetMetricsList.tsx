import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text, AssetMetrics } from '@homzhub/common/src/components';

interface IAssetMetrics {
  id: number;
  header: string;
  value: string | number;
  colorA: string;
  colorB: string;
}

interface IProps {
  assetCount?: number;
  subscription: string;
  data: IAssetMetrics[];
}

const AssetMetricsList = (props: IProps): React.ReactElement => {
  const { assetCount = 0, subscription, data } = props;
  const { t } = useTranslation();

  const renderKeyExtractor = (item: IAssetMetrics, index: number): string => {
    return `${item.id}-${index}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.property}>
        <View style={styles.logo}>
          <Icon name={icons.heartOutline} color={theme.colors.darkTint4} size={40} />
        </View>
        <View style={styles.assetInfo}>
          <Text type="regular" textType="bold" style={styles.assetCount}>
            {assetCount}
          </Text>
          <Text type="small" textType="semiBold" style={styles.propertyText}>
            {t('common:properties')}
          </Text>
          <Text type="small" textType="light" style={styles.propertyText}>
            {subscription}
          </Text>
        </View>
      </View>
      <View style={styles.assetMetrics}>
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }: { item: IAssetMetrics }): React.ReactElement => {
            const { header, value, colorA, colorB } = item;
            return <AssetMetrics header={header} value={value} colorA={colorA} colorB={colorB} />;
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
    borderRadius: 10,
    height: 220,
  },
  property: {
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assetInfo: {
    flex: 1,
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
});
