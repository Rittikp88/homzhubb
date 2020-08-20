import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components';

export const RentAndMaintenance = (): React.ReactElement => {
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.contentView}>
          <Icon name={icons.home} color={theme.colors.darkTint3} size={18} style={styles.iconStyle} />
          <Label type="large">Rent: </Label>
          <Label type="large" textType="semiBold" style={styles.status}>
            Paid
          </Label>
        </View>
        <Text type="small" textType="semiBold" style={styles.amount}>
          $ 2700/-
        </Text>
      </View>
      <View>
        <View style={styles.contentView}>
          <Icon name={icons.settingOutline} color={theme.colors.darkTint3} size={18} style={styles.iconStyle} />
          <Label type="large">Maintenance: </Label>
          <Label type="large" textType="semiBold" style={styles.status}>
            Due
          </Label>
        </View>
        <Text type="small" textType="semiBold" style={styles.amount}>
          $ 7500/-
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
