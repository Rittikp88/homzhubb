import React from 'react';
import { StyleSheet, View, FlatList, StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text, Label, Divider } from '@homzhub/common/src/components';

interface ISubscriptionPlan {
  id: number;
  name: string;
}

interface IProps {
  data: ISubscriptionPlan[];
  planName: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const AssetSubscriptionPlan = (props: IProps): React.ReactElement => {
  const { data, planName, containerStyle } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetDashboard);

  const renderKeyExtractor = (item: ISubscriptionPlan, index: number): string => {
    return `${item.id}-${index}`;
  };

  const renderFeatures = (): React.ReactElement => {
    return (
      <FlatList
        data={data}
        numColumns={2}
        renderItem={({ item }: { item: ISubscriptionPlan }): React.ReactElement => {
          const { name } = item;
          return (
            <View style={styles.featuresData}>
              <Icon name={icons.circularCheckFilled} color={theme.colors.green} size={35} />
              <Text type="small" textType="regular" style={styles.featureName}>
                {name}
              </Text>
            </View>
          );
        }}
        keyExtractor={renderKeyExtractor}
      />
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.currentSubscription}>
        <View style={styles.flexThree}>
          <Label type="large" textType="regular" style={styles.planName}>
            {t('subscribedFor')}
          </Label>
          <Text type="regular" textType="bold" style={styles.planName}>
            {planName}
          </Text>
        </View>
        <View style={styles.flexOne}>
          <Icon name={icons.area} color={theme.colors.darkTint4} size={40} />
        </View>
      </View>
      <Divider />
      {renderFeatures()}
    </View>
  );
};

export { AssetSubscriptionPlan };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: 10,
    borderRadius: 10,
  },
  currentSubscription: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  featuresData: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  flexThree: {
    flex: 3,
  },
  flexOne: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planName: {
    color: theme.colors.darkTint5,
    marginVertical: 2,
  },
  featureName: {
    width: 125,
    marginLeft: 5,
  },
});
