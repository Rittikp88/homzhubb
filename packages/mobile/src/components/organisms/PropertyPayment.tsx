import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { isEqual } from 'lodash';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { PaymentRepository } from '@homzhub/common/src/domain/repositories/PaymentRepository';
import { RecordAssetRepository } from '@homzhub/common/src/domain/repositories/RecordAssetRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider, Label, Text } from '@homzhub/common/src/components';
import HomzhubCoins from '@homzhub/mobile/src/components/molecules/HomzhubCoins';
import OrderSummary from '@homzhub/mobile/src/components/molecules/OrderSummary';
import PromoCode from '@homzhub/mobile/src/components/molecules/PromoCode';
import { PaymentGateway } from '@homzhub/mobile/src/components/molecules/PaymentGateway';
import { TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { OrderSummary as Summary } from '@homzhub/common/src/domain/models/OrderSummary';
import { Payment } from '@homzhub/common/src/domain/models/Payment';
import { ValueAddedService, ISelectedValueServices } from '@homzhub/common/src/domain/models/ValueAddedService';
import { ILastVisitedStep } from '@homzhub/common/src/domain/models/LastVisitedStep';
import {
  IOrderSummaryPayload,
  IPaymentSuccess,
  IUpdateAssetParams,
} from '@homzhub/common/src/domain/repositories/interfaces';

interface IPaymentProps {
  goBackToService: () => void;
  valueAddedServices: ValueAddedService[];
  setValueAddedServices: (payload: ISelectedValueServices) => void;
  handleNextStep: () => void;
  typeOfPlan: TypeOfPlan;
  propertyId: number;
  lastVisitedStep: ILastVisitedStep;
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

  public async componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<IPaymentState>): Promise<void> {
    const { valueAddedServices, goBackToService } = this.props;

    if (isEqual(prevProps.valueAddedServices, valueAddedServices)) {
      return;
    }

    if (valueAddedServices.filter((service) => service.value).length === 0) {
      goBackToService();
      return;
    }

    await this.getOrderSummary();
  }

  public render(): React.ReactNode {
    const { isCoinApplied, orderSummary, isPromoFailed } = this.state;
    const { t } = this.props;

    return (
      <View style={styles.container}>
        {this.renderServices()}
        <HomzhubCoins
          disabled={orderSummary.coins?.currentBalance <= 0}
          onToggle={this.onToggleCoin}
          selected={isCoinApplied}
          coins={orderSummary.coins}
        />
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
            title={t('assetFinancial:payNow')}
            containerStyle={styles.payButton}
            initiatePayment={this.initiatePayment}
            onPaymentSuccess={this.onPaymentSuccess}
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

  private renderServices = (): React.ReactNode => {
    const { t, valueAddedServices } = this.props;

    return (
      <View style={styles.servicesContainer}>
        <Text type="small" textType="semiBold" style={styles.serviceTitle}>
          {t('property:services')}
        </Text>
        {valueAddedServices.map((item) => {
          return this.renderItem(item);
        })}
      </View>
    );
  };

  private renderItem = (item: ValueAddedService): React.ReactNode => {
    const { t, setValueAddedServices } = this.props;
    const removeService = (): void => setValueAddedServices({ id: item.id, value: false });

    if (!item.value) {
      return null;
    }

    return (
      <>
        <View style={styles.serviceItem}>
          <View style={styles.content}>
            <Text type="small" textType="semiBold" style={styles.serviceName}>
              {item.valueBundle.label}
            </Text>
            <Text type="small" textType="semiBold" style={styles.serviceAmount}>
              {`${item.currency.currencySymbol} ${item.bundlePrice}`}
            </Text>
          </View>
          <TouchableOpacity onPress={removeService} style={styles.removeView}>
            <Icon name={icons.trash} color={theme.colors.blue} size={16} />
            <Label type="large" textType="semiBold" style={styles.removeText}>
              {t('remove')}
            </Label>
          </TouchableOpacity>
        </View>
        <Divider containerStyles={styles.divider} />
      </>
    );
  };

  private onToggleCoin = async (): Promise<void> => {
    const {
      isCoinApplied,
      orderSummary: { coins },
    } = this.state;
    this.setState({ isCoinApplied: !isCoinApplied });
    await this.getOrderSummary({ coins: coins.currentBalance });
  };

  private onPaymentSuccess = async (paymentSuccessData: IPaymentSuccess): Promise<void> => {
    const { handleNextStep, lastVisitedStep, typeOfPlan, propertyId } = this.props;

    const updateAssetPayload: IUpdateAssetParams = {
      last_visited_step: {
        ...lastVisitedStep,
        listing: {
          ...lastVisitedStep.listing,
          type: typeOfPlan,
          is_payment_done: true,
        },
      },
    };

    try {
      await PaymentRepository.valueAddedServicesPayment(paymentSuccessData);
      await AssetRepository.updateAsset(propertyId, updateAssetPayload);
      handleNextStep();
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private applyPromo = async (code: string): Promise<void> => {
    await this.getOrderSummary({ promo_code: code });
  };

  private clearPromo = (): void => {
    this.setState({ isPromoFailed: false });
  };

  private initiatePayment = (): Promise<Payment> => {
    const { propertyId } = this.props;
    return PaymentRepository.valueAddedServices({
      ...(this.getServiceIds().length > 0 && { value_added_services: this.getServiceIds() }),
      ...(propertyId && { asset: propertyId }),
    });
  };

  private getServiceIds = (): number[] => {
    const { valueAddedServices } = this.props;
    const selectedServices: number[] = [];

    valueAddedServices.forEach((service) => {
      if (service.value) {
        selectedServices.push(service.id);
      }
    });

    return selectedServices;
  };

  private getOrderSummary = async (data?: IOrderSummaryPayload): Promise<void> => {
    const { propertyId } = this.props;
    const payload: IOrderSummaryPayload = {
      ...(this.getServiceIds().length > 0 && { value_added_services: this.getServiceIds() }),
      ...(propertyId && { asset: propertyId }),
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
