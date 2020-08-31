import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components';
import { Transaction } from '@homzhub/common/src/domain/models/LeaseTransaction';

interface IProps {
  rentData: Transaction;
  depositData: Transaction;
}

export const RentAndMaintenance = ({ rentData, depositData }: IProps): React.ReactElement => {
  const { label, currencySymbol, amount, status } = rentData;
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.contentView}>
          <Icon name={icons.home} color={theme.colors.darkTint3} size={20} style={styles.iconStyle} />
          <Label type="large">{label}: </Label>
          <Label type="large" textType="semiBold" style={styles.status}>
            {status}
          </Label>
        </View>
        <Text type="small" textType="semiBold" style={styles.amount}>
          {`${currencySymbol} ${amount}`}
        </Text>
      </View>
      <View>
        <View style={styles.contentView}>
          <Icon name={icons.settingOutline} color={theme.colors.darkTint3} size={20} style={styles.iconStyle} />
          <Label type="large">{depositData.label}: </Label>
          <Label type="large" textType="semiBold" style={styles.status}>
            {depositData.status}
          </Label>
        </View>
        <Text type="small" textType="semiBold" style={styles.amount}>
          {`${depositData.currencySymbol} ${depositData.amount}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconStyle: {
    marginRight: 8,
  },
  status: {
    color: theme.colors.green,
  },
  amount: {
    marginTop: 2,
    marginLeft: 24,
  },
});
