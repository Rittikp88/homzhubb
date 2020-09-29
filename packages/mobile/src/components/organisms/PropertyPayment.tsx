import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider, Label, Text } from '@homzhub/common/src/components';
import HomzhubCoins from '@homzhub/mobile/src/components/molecules/HomzhubCoins';
import OrderSummary from '@homzhub/mobile/src/components/molecules/OrderSummary';
import PromoCode from '@homzhub/mobile/src/components/molecules/PromoCode';
import { PaymentGateway } from '@homzhub/mobile/src/components/molecules/PaymentGateway';
import { Services } from '@homzhub/common/src/mocks/ValueAddedServices';
import { RecordAssetRepository } from '@homzhub/common/src/domain/repositories/RecordAssetRepository';
import { IOrderSummaryPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { OrderSummary as Summary } from '@homzhub/common/src/domain/models/OrderSummary';

interface IPaymentProps {
  handleNextStep: () => void;
}

interface IPaymentState {
  isCoinApplied: boolean;
  isPromoFailed: boolean;
  orderSummary: Summary;
}

type Props = IPaymentProps & WithTranslation;

export class PropertyPayment extends Component<Props, IPaymentState> {
  public state = {
    isCoinApplied: false,
    isPromoFailed: false,
    orderSummary: {} as Summary,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getOrderSummary();
  };

  public render(): React.ReactNode {
    const { isCoinApplied, orderSummary, isPromoFailed } = this.state;
    const { t, handleNextStep } = this.props;
    return (
      <View style={styles.container}>
        {this.renderServices()}
        <HomzhubCoins onToggle={this.onToggleCoin} selected={isCoinApplied} coins={orderSummary.coins} />
        <PromoCode
          onApplyPromo={this.applyPromo}
          promo={orderSummary.promo}
          isError={isPromoFailed}
          onClear={this.clearPromo}
        />
        <OrderSummary summary={orderSummary} />
        {orderSummary.amountPayable && (
          <PaymentGateway
            type="primary"
            amount={orderSummary.amountPayable}
            title={t('assetFinancial:payNow')}
            containerStyle={styles.payButton}
            onPaymentSuccess={handleNextStep}
          />
        )}
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
        <FlatList data={Services} renderItem={this.renderItem} ItemSeparatorComponent={this.renderSeparator} />
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
            {`₹ ${item.isPrice}`}
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

  private onToggleCoin = async (): Promise<void> => {
    const {
      isCoinApplied,
      orderSummary: { coins },
    } = this.state;
    this.setState({ isCoinApplied: !isCoinApplied });
    await this.getOrderSummary({ coins: coins.currentBalance });
  };

  private applyPromo = async (code: string): Promise<void> => {
    await this.getOrderSummary({ promo_code: code });
  };

  private clearPromo = (): void => {
    this.setState({ isPromoFailed: false });
  };

  private getOrderSummary = async (data?: IOrderSummaryPayload): Promise<void> => {
    const payload: IOrderSummaryPayload = {
      services: [1, 2],
      ...(data?.coins && { coins: data.coins }),
      ...(data?.promo_code && { promo_code: data.promo_code }),
    };
    try {
      const response = await RecordAssetRepository.getOrderSummary(payload);
      this.setState({ orderSummary: response });
    } catch (e) {
      if (data?.promo_code) {
        this.setState({ isPromoFailed: true });
      }
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };
}

export default withTranslation()(PropertyPayment);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
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
