import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import HomzhubCoins from '@homzhub/common/src/components/molecules/HomzhubCoins';
import OrderSummary from '@homzhub/common/src/components/molecules/OrderSummary';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import PromoCode from '@homzhub/common/src/components/molecules/PromoCode';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { PaymentGateway } from '@homzhub/mobile/src/components';
import { Coins } from '@homzhub/common/src/domain/models/OrderSummary';
import { DueOrderSummary, DueOrderSummaryAction } from '@homzhub/common/src/domain/models/DueOrderSummary';
import { Payment } from '@homzhub/common/src/domain/models/Payment';
import { IProcessPaymentPayload } from '@homzhub/common/src/modules/financials/interfaces';
import { ITypographyProps } from '@homzhub/common/src/components/atoms/Typography';
import {
  DuePaymentActions,
  IDueOrderSummaryAction,
  IPaymentParams,
  IPaymentPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { IListData } from '@homzhub/common/src/domain/models/Asset';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const DuesOrderSummary = (): React.ReactElement | null => {
  const { goBack, navigate } = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentDueId = useSelector(FinancialSelectors.getCurrentDueId);

  const [areCoinsApplied, setAreCoinsApplied] = useState(false);
  const [isPromoSelected, setIsPromoSelected] = useState(false);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isPromoFailed, setIsPromoFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderSummary, setOrderSummary] = useState<DueOrderSummary | null>(null);

  const resetStates = (): void => {
    setAreCoinsApplied(false);
    setIsPromoApplied(false);
    setIsPromoFailed(false);
    setIsPromoSelected(false);
  };

  useEffect(() => {
    getOrderSummary().then();
    return (): void => {
      resetStates();
    };
  }, []);

  const getOrderSummary = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await LedgerRepository.getDueOrderSummary(currentDueId);
      setOrderSummary(response);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details.message), statusCode: e.details.statusCode });
    }
  };

  const handleAction = async (payload: IDueOrderSummaryAction): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await LedgerRepository.dueOrderSummaryAction(currentDueId, payload);
      setOrderSummary(response);
      if (isPromoSelected) {
        setIsPromoApplied(true);
      }
      if (isPromoFailed) {
        setIsPromoFailed(false);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      if (isPromoSelected) {
        setIsPromoFailed(true);
      }
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details.message), statusCode: e.details.statusCode });
    }
  };

  const handleCoins = async (): Promise<void> => {
    const payload: IDueOrderSummaryAction = {
      action: DueOrderSummaryAction.REFRESH_INVOICE_AMOUNT,
      coins: orderSummary?.coins?.currentBalance,
    };
    await handleAction(payload);
  };

  const handlePromo = async (code: string): Promise<void> => {
    const payload: IDueOrderSummaryAction = {
      action: DueOrderSummaryAction.REFRESH_INVOICE_AMOUNT,
      promo_code: code,
    };
    await handleAction(payload);
  };

  const onOrderPlaced = (paymentParams: IPaymentParams): void => {
    setIsLoading(true);
    const getBody = (): IPaymentPayload => {
      // Payment successful
      if (paymentParams.razorpay_payment_id) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentParams;
        return {
          action: DuePaymentActions.PAYMENT_CAPTURED,
          payload: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
        };
      }
      // Payment cancelled
      const { razorpay_order_id } = paymentParams;
      return {
        action: DuePaymentActions.PAYMENT_CANCELLED,
        payload: { razorpay_order_id },
      };
    };

    const payload: IProcessPaymentPayload = {
      data: getBody(),
      onCallback: (status) => {
        if (status && paymentParams.razorpay_payment_id) {
          navigate(ScreensKeys.FinancialsLandingScreen);
          AlertHelper.success({
            message: t('assetFinancial:paidSuccessfully', { amount: orderSummary?.totalPriceFormatted }),
          });
        }
        setIsLoading(false);
      },
    };

    dispatch(FinancialActions.processPayment(payload));
  };

  const initiatePayment = async (): Promise<Payment | null> => {
    const payload: IDueOrderSummaryAction = {
      action: DueOrderSummaryAction.TRIGGER_PAYMENT,
      ...(isPromoApplied && { promo_code: orderSummary?.promo?.code }),
      ...(areCoinsApplied && { coins: orderSummary?.coins?.coinsUsed }),
    };
    try {
      const response = await LedgerRepository.dueOrderSummaryAction(currentDueId, payload);
      return response.order;
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details.message), statusCode: e.details.statusCode });
      return null;
    }
  };

  const onToggleCoins = (): void => {
    // Unselecting the coins -> Call GET again
    if (areCoinsApplied) {
      getOrderSummary().then(() => {
        setAreCoinsApplied(false);
      });
      return;
    }
    if (orderSummary && orderSummary.coins && orderSummary.coins.currentBalance > 0) {
      handleCoins().then(() => {
        setAreCoinsApplied(true);
      });
    }
  };

  const onTogglePromoCode = (): void => {
    if (isPromoSelected) {
      if (isPromoApplied) {
        getOrderSummary().then();
        setIsPromoApplied(false);
      }
      setIsPromoFailed(false);
    }
    setIsPromoSelected((initValue) => !initValue);
  };

  const onApplyPromo = (code: string): void => {
    // Call API with applied promo.
    if (code.length) {
      handlePromo(code).then();
      return;
    }
    // For empty promo, refresh the data.
    onClearPromo();
  };

  const onClearPromo = (): void => {
    setIsPromoFailed(false);
    setIsPromoApplied(false);
    getOrderSummary().then();
  };

  const ShowInvoiceSummary = (): React.ReactElement | null => {
    if (!orderSummary) return null;

    const keyExtractor = (item: IListData, index: number): string => `${item.label}[${index}]`;

    const renderItem = ({ item }: { item: IListData }): React.ReactElement => (
      <View style={styles.itemsContainer}>
        <Text type="small" textType={item.isTitle ? 'semiBold' : 'regular'} style={styles.listValue}>
          {item.label}
        </Text>
        <Text type="small" textType={item.isTitle ? 'semiBold' : 'regular'} style={styles.listValue}>
          {item.value}
        </Text>
      </View>
    );

    const TotalView = (): React.ReactElement => {
      return (
        <View style={styles.totalView}>
          <Divider containerStyles={styles.divider} />
          <View style={styles.totalContent}>
            <Text type="small" textType="semiBold" style={styles.totalText}>
              Total
            </Text>
            <Text type="small" textType="semiBold" style={styles.totalText}>
              {orderSummary.totalBasePriceFormatted}
            </Text>
          </View>
        </View>
      );
    };

    return (
      <View style={styles.topSummaryContainer}>
        <FlatList data={orderSummary.userInvoiceItemsFormatted} keyExtractor={keyExtractor} renderItem={renderItem} />
        <TotalView />
      </View>
    );
  };

  if (!orderSummary) return <Loader visible />;

  const {
    asset,
    dueTitle,
    coins,
    dueOrderSummaryList,
    totalPricePayableFormatted,
    currency,
    invoiceTitle,
    countryFlag,
  } = orderSummary;

  const primaryAddressStyles: ITypographyProps = {
    variant: 'text',
    size: 'small',
  };

  const subAddressStyles: ITypographyProps = {
    size: 'regular',
    variant: 'label',
  };

  const onBackIconPress = (): void => {
    resetStates();
    goBack();
  };

  return (
    <Screen
      headerProps={{
        title: t('property:orderSummary'),
        onIconPress: onBackIconPress,
      }}
      contentContainerStyle={styles.screenContentContainer}
      scrollEnabled
      isLoading={isLoading}
    >
      <View style={styles.containerPadding}>
        <Text type="small" textType="regular" style={styles.orderSummaryText}>
          {t('property:orderSummary')}
        </Text>
        <PropertyAddressCountry
          primaryAddress={asset ? asset.projectName : dueTitle}
          primaryAddressTextStyles={primaryAddressStyles}
          subAddress={asset ? asset.formattedAddressWithCity : invoiceTitle}
          subAddressTextStyles={subAddressStyles}
          containerStyle={styles.addressContainer}
          countryFlag={countryFlag}
        />
        {orderSummary && <ShowInvoiceSummary />}
      </View>
      <HomzhubCoins
        onToggle={onToggleCoins}
        disabled={isPromoSelected || Boolean(coins && coins.currentBalance <= 0)}
        selected={areCoinsApplied}
        coins={coins ?? new Coins()}
        hasBalanceInNewLine
        containerStyle={styles.coinsContainer}
        showCoinCount={Boolean(coins && coins.currentBalance > 0)}
      />
      <View style={styles.containerPadding}>
        <PromoCode
          type="regular"
          onApplyPromo={onApplyPromo}
          isPromoApplied={isPromoApplied}
          isError={isPromoFailed}
          onClear={onClearPromo}
          hasToggleButton
          isToggleButtonSelected={isPromoSelected}
          onToggle={onTogglePromoCode}
          containerStyles={styles.promoContainer}
          isToggleButtonDisabled={areCoinsApplied}
        />
        <OrderSummary
          summaryList={dueOrderSummaryList}
          amountPayableText={totalPricePayableFormatted}
          currency={currency}
          containerStyle={styles.orderSummaryContainer}
          showOrderSummaryHeader={false}
          hasDottedDivider
        />
        {orderSummary.totalPricePayable > 0 && (
          <PaymentGateway
            type="primary"
            title={t('assetFinancial:payNow')}
            containerStyle={styles.payButton}
            // @ts-ignore
            initiatePayment={initiatePayment}
            paymentApi={onOrderPlaced}
          />
        )}
        <View style={styles.secureView}>
          <Icon name={icons.badge} color={theme.colors.darkTint7} size={28} />
          <Label type="large" textType="semiBold" style={styles.secureText}>
            {t('property:securePayment')}
          </Label>
        </View>
      </View>
    </Screen>
  );
};

export default DuesOrderSummary;

const styles = StyleSheet.create({
  listValue: {
    color: theme.colors.darkTint3,
  },
  totalText: {
    color: theme.colors.darkTint2,
  },
  totalView: {
    marginBottom: 16,
  },
  totalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  divider: {
    borderWidth: 1,
    borderColor: theme.colors.darkTint7,
  },
  itemsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  screenContentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 0,
    backgroundColor: theme.colors.white,
  },
  addressContainer: {
    marginTop: 14,
    marginBottom: 10,
  },
  coinsContainer: {
    backgroundColor: theme.colors.moreSeparator,
    paddingHorizontal: 16,
  },
  orderSummaryContainer: {
    marginHorizontal: 0,
  },
  orderSummaryText: {
    color: theme.colors.darkTint4,
  },
  topSummaryContainer: {
    marginBottom: 10,
  },
  promoContainer: {
    marginHorizontal: 0,
  },
  payButton: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  secureView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center',
  },
  secureText: {
    color: theme.colors.darkTint7,
    marginLeft: 6,
  },
  containerPadding: {
    paddingHorizontal: 16,
  },
});
