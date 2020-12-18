import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import Accordian from '@homzhub/web/src/screens/Financials/Transactions/Accordian';

const Transactions = (): React.ReactElement => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name={icons.wallet} size={22} color={theme.colors.darkTint3} />
        <Text type="small" textType="semiBold" style={styles.text}>
          {t('assetDashboard:Transaction')}
        </Text>
      </View>
      <ScrollView>
        <Accordian />
        <Accordian />
        <Accordian />
        <Accordian />
        <Accordian /> <Accordian />
        <Accordian />
        <Accordian />
        <Accordian />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    padding: 15,
    height: 600,
  },
  amount: {
    marginRight: 10,
    color: theme.colors.error,
  },
  header: {
    flexDirection: 'row',
    margin: 10,
  },
  leftChild: {
    flexDirection: 'row',
  },
  text: { marginLeft: 10, color: theme.colors.darkTint1 },
});
export default Transactions;
