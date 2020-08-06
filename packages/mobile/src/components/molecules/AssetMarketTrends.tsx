import React from 'react';
import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text, Label } from '@homzhub/common/src/components';

interface IMarketTrends {
  id: number;
  header: string;
  date: string;
}

interface IProps {
  data: IMarketTrends[];
  containerStyle?: StyleProp<ViewStyle>;
  onViewAllPress?: () => void;
}

const AssetMarketTrends = (props: IProps): React.ReactElement => {
  const { data, containerStyle, onViewAllPress } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetDashboard);

  const renderKeyExtractor = (item: IMarketTrends, index: number): string => {
    return `${item.id}-${index}`;
  };

  const renderTrends = (): React.ReactElement => {
    if (data.length === 0) {
      return (
        <View style={styles.noData}>
          <Text type="small" textType="regular">
            {t('noTrends')}
          </Text>
        </View>
      );
    }
    return (
      <FlatList
        data={data.slice(0, 2)} // TODO: Logic to be checked
        renderItem={({ item }: { item: IMarketTrends }): React.ReactElement => {
          const { header, date } = item;
          const onLinkPress = (): void => {
            // TODO: Add the logic here
          };
          return (
            <View style={styles.trendContainer}>
              <View style={styles.trendData}>
                <Text type="small" textType="regular" style={styles.trendHeader}>
                  {header}
                </Text>
                <Icon name={icons.rightArrow} color={theme.colors.primaryColor} size={20} onPress={onLinkPress} />
              </View>
              <Label type="large" textType="regular" style={styles.trendDate}>
                {date}
              </Label>
            </View>
          );
        }}
        keyExtractor={renderKeyExtractor}
      />
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <View style={styles.marketTrends}>
          <Icon name={icons.increase} color={theme.colors.darkTint4} size={20} />
          <Text type="regular" textType="semiBold" style={styles.headerText}>
            {t('marketTrends')}
          </Text>
        </View>
        <Text type="small" textType="semiBold" onPress={onViewAllPress} style={styles.viewAll}>
          {t('viewAll')}
        </Text>
      </View>
      {renderTrends()}
    </View>
  );
};

export { AssetMarketTrends };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    paddingVertical: 10,
  },
  marketTrends: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  headerText: {
    marginLeft: 8,
  },
  trendContainer: {
    padding: 10,
  },
  viewAll: {
    flex: 0,
    borderWidth: 0,
    color: theme.colors.primaryColor,
    marginRight: 15,
  },
  noData: {
    flex: 1,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendHeader: {
    color: theme.colors.primaryColor,
    width: 320,
  },
  trendDate: {
    color: theme.colors.darkTint4,
  },
});
