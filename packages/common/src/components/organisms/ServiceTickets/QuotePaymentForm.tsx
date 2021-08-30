import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { PaymentGateway } from '@homzhub/mobile/src/components/molecules/PaymentGateway';
import PaymentGatewayWeb from '@homzhub/web/src/components/molecules/PaymentGateway';
import { Payment } from '@homzhub/common/src/domain/models/Payment';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

// TODO: (Shikha) - Remove dummy data after API integration
const data = [
  { title: 'Painting Quote', value: '$ 1200' },
  { title: 'Sepage Quote', value: '$ 14000' },
];

interface IRowProp {
  title: string;
  value: string;
  isTextField?: boolean;
  color?: string;
}

const QuotePaymentForm = (): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.serviceTickets);

  // @ts-ignore
  const initiatePayment = (): Promise<Payment> => {
    // TODO: (Shikha) - Initiate Payment
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

  return (
    <View style={styles.container}>
      <Text type="small" textType="semiBold">
        {t('title')}
      </Text>
      <Label type="large" style={styles.description}>
        {t('makePaymentForQuote')}
      </Label>
      {data.map((item) => {
        return renderRow({ title: item.title, value: item.value, color: theme.colors.primaryColor });
      })}
      <Text type="small" textType="semiBold" style={styles.summary}>
        {t('property:orderSummary')}
      </Text>
      <Label type="large" style={styles.description}>
        {t('quoteInfo')}
      </Label>
      <Divider containerStyles={styles.divider} />
      {renderRow({ title: t('property:youPay'), value: t('$ 1111000'), isTextField: true })}
      <Divider containerStyles={styles.divider} />
      <View style={styles.buttonView}>
        <Button type="secondary" title={t('payLater')} />
        <View style={styles.buttonSeparator} />
        {PlatformUtils.isWeb() ? (
          <PaymentGatewayWeb
            type="primary"
            title={t('assetFinancial:payNow')}
            containerStyle={styles.payButton}
            initiatePayment={initiatePayment}
            paymentApi={FunctionUtils.noop}
          />
        ) : (
          <PaymentGateway
            type="primary"
            title={t('assetFinancial:payNow')}
            outerContainerStyle={styles.payButton}
            initiatePayment={initiatePayment}
            paymentApi={FunctionUtils.noop}
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
