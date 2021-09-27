import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { PaymentRepository } from '@homzhub/common/src/domain/repositories/PaymentRepository';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { TicketSelectors } from '@homzhub/common/src/modules/tickets/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { PaymentGateway } from '@homzhub/mobile/src/components/molecules/PaymentGateway';
import PaymentGatewayWeb from '@homzhub/web/src/components/molecules/PaymentGateway';
import { InvoiceId } from '@homzhub/common/src/domain/models/InvoiceSummary';
import { Payment } from '@homzhub/common/src/domain/models/Payment';
import { DuePaymentActions, InvoiceActions, IPaymentParams } from '@homzhub/common/src/domain/repositories/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  payLaterSheet: (callback: () => Promise<InvoiceId>, onClose: () => void) => React.ReactElement;
  onSuccess: () => void;
  setLoader: (value: boolean) => void;
}

interface IRowProp {
  title: string;
  value: string;
  isTextField?: boolean;
  color?: string;
}

const QuotePaymentForm = ({ payLaterSheet, onSuccess, setLoader }: IProps): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);
  const selectedTicket = useSelector(TicketSelectors.getCurrentTicket);
  const summary = useSelector(TicketSelectors.getInvoiceSummary);
  const [isPayLater, setPayLater] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (selectedTicket) {
      dispatch(
        TicketActions.getInvoiceSummary({
          action: InvoiceActions.TICKET_ORDER_SUMMARY,
          payload: {
            ticket: selectedTicket.ticketId,
          },
        })
      );
    }
  }, []);

  const generateInvoice = async (): Promise<InvoiceId> => {
    return await PaymentRepository.getInvoice({
      action: InvoiceActions.TICKET_INVOICE,
      payload: {
        ticket: selectedTicket?.ticketId ?? 0,
        ...(summary && { quotes: summary.userInvoiceItems.map((item) => item.id) }),
      },
    });
  };

  const initiatePayment = async (): Promise<Payment> => {
    const res = await generateInvoice();
    return await PaymentRepository.initiatePayment(res.userInvoiceId);
  };

  const onPayLater = (): void => {
    setPayLater(true);
  };

  const onCloseSheet = (): void => {
    setPayLater(false);
  };

  const paymentApi = (paymentParams: IPaymentParams): void => {
    let payload;
    setIsDisabled(true);
    setLoader(true);
    if (paymentParams.razorpay_payment_id) {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentParams;
      payload = {
        action: DuePaymentActions.PAYMENT_CAPTURED,
        payload: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
      };
    } else {
      // Payment cancelled
      const { razorpay_order_id } = paymentParams;
      payload = {
        action: DuePaymentActions.PAYMENT_CANCELLED,
        payload: { razorpay_order_id },
      };
    }

    dispatch(FinancialActions.processPayment({ data: payload, onCallback: handleCallback }));
  };

  const handleCallback = (status: boolean): void => {
    if (status) {
      onSuccess();
    } else {
      setIsDisabled(false);
    }

    setLoader(false);
  };

  const renderRow = (rowProp: IRowProp): React.ReactElement => {
    const { title, value, isTextField, color = theme.colors.darkTint2 } = rowProp;
    return (
      <View style={styles.rowView}>
        <Typography
          variant={isTextField ? 'text' : 'label'}
          size={isTextField ? 'small' : 'large'}
          fontWeight="semiBold"
        >
          {title}
        </Typography>
        <Typography
          variant={isTextField ? 'text' : 'label'}
          size={isTextField ? 'small' : 'large'}
          fontWeight="semiBold"
          style={{ color }}
        >
          {value}
        </Typography>
      </View>
    );
  };

  if (!summary) return <EmptyState />;

  return (
    <>
      <View style={styles.container}>
        <Text type="small" textType="semiBold">
          {t('title')}
        </Text>
        <Label type="large" style={styles.description}>
          {t('makePaymentForQuote')}
        </Label>
        {summary.invoiceSummary.map((item) => {
          return renderRow({ title: item.title, value: item.value, color: theme.colors.primaryColor });
        })}
        <Text type="small" textType="semiBold" style={styles.summary}>
          {t('property:orderSummary')}
        </Text>
        <Label type="large" style={styles.description}>
          {t('quoteInfo')}
        </Label>
        <Divider containerStyles={styles.divider} />
        {renderRow({ title: t('property:youPay'), value: summary.formattedPrice, isTextField: true })}
        <Divider containerStyles={styles.divider} />
        <View style={styles.buttonView}>
          <Button type="secondary" title={t('payLater')} onPress={onPayLater} />
          <View style={styles.buttonSeparator} />
          {PlatformUtils.isWeb() ? (
            <PaymentGatewayWeb
              type="primary"
              title={t('assetFinancial:payNow')}
              containerStyle={styles.payButton}
              initiatePayment={initiatePayment}
              paymentApi={paymentApi}
            />
          ) : (
            <PaymentGateway
              type="primary"
              disabled={isDisabled}
              title={t('assetFinancial:payNow')}
              outerContainerStyle={styles.payButton}
              initiatePayment={initiatePayment}
              paymentApi={paymentApi}
            />
          )}
        </View>
        <View style={styles.secureView}>
          <Icon name={icons.badge} color={theme.colors.darkTint7} size={24} />
          <Label type="large" textType="semiBold" style={styles.secureText}>
            {t('property:securePayment')}
          </Label>
        </View>
      </View>
      {isPayLater && payLaterSheet(generateInvoice, onCloseSheet)}
    </>
  );
};

export default QuotePaymentForm;

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  description: {
    color: theme.colors.darkTint3,
    marginBottom: 24,
    marginTop: 6,
  },
  summary: {
    color: theme.colors.darkTint4,
    marginTop: 24,
  },
  secureView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    justifyContent: 'center',
  },
  divider: {
    borderStyle: 'dashed',
  },
  buttonView: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonSeparator: {
    width: 16,
  },
  secureText: {
    color: theme.colors.darkTint7,
    marginLeft: 6,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    justifyContent: 'space-between',
  },
  payButton: {
    flex: 1,
    marginHorizontal: 0,
  },
});
