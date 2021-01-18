import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import Dues from '@homzhub/web/src/screens/financials/DuesCard/Dues';

const DuesCard = (): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.leftChild}>
          <Icon name={icons.wallet} size={22} color={theme.colors.darkTint3} />
          <Text type="small" textType="semiBold" style={styles.text}>
            {t('assetDashboard:dues')}
          </Text>
        </View>
        <Text type="small" textType="semiBold" style={styles.amount}>
          $100,000
        </Text>
      </View>
      <ScrollView>
        <Dues />
        <Dues />
        <Dues /> <Dues />
        <Dues />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    padding: 15,
    height: 350,
  },
  amount: {
    marginRight: 10,
    color: theme.colors.error,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
  },
  leftChild: {
    flexDirection: 'row',
  },
  text: { marginLeft: 10, color: theme.colors.darkTint1 },
});
export default DuesCard;
