import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import Coin from '@homzhub/common/src/assets/images/coin.svg';
import { Label, RNSwitch, Text } from '@homzhub/common/src/components';
import { Coins } from '@homzhub/common/src/domain/models/OrderSummary';

interface IOwnProps {
  onToggle: () => void;
  selected: boolean;
  coins: Coins;
  disabled?: boolean;
}

type Props = IOwnProps & WithTranslation;

class HomzhubCoins extends PureComponent<Props> {
  public render(): React.ReactNode {
    const { t, onToggle, selected, coins, disabled } = this.props;
    const amount = `₹${coins?.savedAmount ?? 0}`;
    const coinUsed = coins?.coinsUsed ?? 0;
    return (
      <View style={styles.container}>
        <View style={styles.switchView}>
          <Text type="small" textType="semiBold" style={styles.title}>
            {t('useCoins')}
          </Text>
          <RNSwitch disabled={disabled} selected={selected} onToggle={onToggle} />
        </View>
        <View style={styles.balanceView}>
          <Text type="small" style={styles.title}>
            {t('balance')}
          </Text>
          <Coin style={styles.image} />
          <Text type="small" style={styles.title}>
            {coins?.currentBalance ?? 0}
          </Text>
        </View>
        {selected && (
          <Label type="regular" textType="semiBold" style={styles.message}>
            {t('property:usedCoins', { amount, coin: coinUsed })}
          </Label>
        )}
      </View>
    );
  }
}

export default withTranslation(LocaleConstants.namespacesKey.property)(HomzhubCoins);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.moreSeparator,
    padding: 16,
  },
  title: {
    color: theme.colors.darkTint3,
  },
  message: {
    marginTop: 12,
    color: theme.colors.green,
  },
  switchView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceView: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  image: {
    marginHorizontal: 6,
  },
});
