import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider, Label, Text } from '@homzhub/common/src/components';
import HomzhubCoins from '@homzhub/mobile/src/components/molecules/HomzhubCoins';
import OrderSummary from '@homzhub/mobile/src/components/molecules/OrderSummary';
import PromoCode from '@homzhub/mobile/src/components/molecules/PromoCode';
import { PaymentGateway } from '@homzhub/mobile/src/components/molecules/PaymentGateway';

interface IPaymentProps {
  handleNextStep: () => void;
}

interface IPaymentState {
  isCoinApplied: boolean;
}

// TODO: (Shikha) - Remove after API integration
const servicesData = [
  {
    name: 'Professional Photoshoot',
    amount: '₹2000',
  },
  {
    name: 'Scheduled Inspection & Reports',
    amount: '₹1000',
  },
];

type Props = IPaymentProps & WithTranslation;

export class PropertyPayment extends Component<Props, IPaymentState> {
  public state = {
    isCoinApplied: false,
  };

  public render(): React.ReactNode {
    const { isCoinApplied } = this.state;
    const { t } = this.props;
    return (
      <View style={styles.container}>
        {this.renderServices()}
        <HomzhubCoins onToggle={this.onToggleCoin} selected={isCoinApplied} />
        <PromoCode />
        <OrderSummary />
        <PaymentGateway
          type="primary"
          title={t('assetFinancial:payNow')}
          containerStyle={styles.payButton}
          onPaymentSuccess={FunctionUtils.noop}
        />
        <View style={styles.secureView}>
          <Icon name={icons.badge} color={theme.colors.darkTint7} size={28} />
          <Label type="large" textType="semiBold" style={styles.secureText}>
            {t('property:securePayment')}
          </Label>
        </View>
      </View>
    );
  }

  private renderServices = (): React.ReactElement => {
    const { t } = this.props;
    return (
      <View style={styles.servicesContainer}>
        <Text type="small" textType="semiBold" style={styles.serviceTitle}>
          {t('property:services')}
        </Text>
        <FlatList data={servicesData} renderItem={this.renderItem} ItemSeparatorComponent={this.renderSeparator} />
      </View>
    );
  };

  private renderItem = ({ item }: { item: any }): React.ReactElement => {
    const { t } = this.props;
    return (
      <View style={styles.serviceItem}>
        <View style={styles.content}>
          <Text type="small" textType="semiBold" style={styles.serviceName}>
            {item.name}
          </Text>
          <Text type="small" textType="semiBold" style={styles.serviceAmount}>
            {item.amount}
          </Text>
        </View>
        <View style={styles.removeView}>
          <Icon name={icons.trash} color={theme.colors.blue} size={16} />
          <Label type="large" textType="semiBold" style={styles.removeText}>
            {t('remove')}
          </Label>
        </View>
      </View>
    );
  };

  private renderSeparator = (): React.ReactElement => {
    return <Divider containerStyles={styles.divider} />;
  };

  private onToggleCoin = (): void => {
    const { isCoinApplied } = this.state;
    this.setState({ isCoinApplied: !isCoinApplied });
  };
}

export default withTranslation()(PropertyPayment);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    marginHorizontal: 16,
    paddingVertical: 16,
  },
  payButton: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  secureView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    justifyContent: 'center',
  },
  serviceTitle: {
    color: theme.colors.darkTint4,
  },
  secureText: {
    color: theme.colors.darkTint7,
    marginLeft: 6,
  },
  servicesContainer: {
    marginHorizontal: 16,
  },
  serviceItem: {
    marginVertical: 20,
  },
  serviceName: {
    color: theme.colors.darkTint2,
  },
  serviceAmount: {
    color: theme.colors.blue,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  removeView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  removeText: {
    color: theme.colors.blue,
    marginLeft: 4,
  },
  divider: {
    borderColor: theme.colors.darkTint10,
  },
});
