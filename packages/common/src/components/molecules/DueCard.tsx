import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { PropertyAddressCountry } from '@homzhub/common/src/components/molecules/PropertyAddressCountry';
import { PaymentGateway } from '@homzhub/mobile/src/components';
import { DueItem } from '@homzhub/common/src/domain/models/DueItem';
import { Payment } from '@homzhub/common/src/domain/models/Payment';
import { IPaymentParams } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  due: DueItem;
  onInitPayment: () => Promise<Payment>;
  onOrderPlaced: (paymentOptions: IPaymentParams) => void;
}

const DueCard = (props: IProps): React.ReactElement => {
  const { due, onInitPayment, onOrderPlaced } = props;
  const {
    id,
    invoiceTitle,
    asset: {
      projectName,
      formattedAddressWithCity,
      country: { flag },
    },
    totalDue,
  } = due;

  const { t } = useTranslation();

  return (
    <View key={id} style={styles.container}>
      <PropertyAddressCountry
        primaryAddress={projectName}
        primaryAddressTextStyles={{
          variant: 'text',
          size: 'small',
        }}
        subAddressTextStyles={{
          variant: 'label',
          size: 'large',
        }}
        countryFlag={flag}
        showAddress
        subAddress={formattedAddressWithCity}
      />
      <View style={styles.contentContainer}>
        <View style={styles.dueDetailsContainer}>
          <Label type="large" style={styles.dueText}>
            {invoiceTitle}
          </Label>
          <Text textType="semiBold" type="small">
            {totalDue}
          </Text>
        </View>
        <PaymentGateway
          title={t('assetFinancial:payNow')}
          type="primary"
          initiatePayment={onInitPayment}
          outerContainerStyle={styles.paymentButton}
          paymentApi={onOrderPlaced}
        />
      </View>
    </View>
  );
};

export default React.memo(DueCard);

const styles = StyleSheet.create({
  divider: {
    marginVertical: 12,
    borderColor: theme.colors.background,
    borderWidth: 1,
  },
  container: {
    padding: 16,
  },
  paymentButton: {
    flex: 1,
    marginTop: 3,
    marginHorizontal: 0,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  dueDetailsContainer: {
    flex: 2,
  },
  dueText: {
    marginBottom: 2,
  },
});
