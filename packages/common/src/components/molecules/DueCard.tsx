import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Cross from '@homzhub/common/src/assets/images/circularCross.svg';
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
  onPressClose?: (dueId?: number) => void;
}

const DueCard = (props: IProps): React.ReactElement => {
  const { due, onInitPayment, onOrderPlaced, onPressClose } = props;
  const { id, invoiceTitle, asset, totalDue } = due;

  const { t } = useTranslation();

  const onPressCrossIcon = (): void => {
    if (onPressClose) {
      onPressClose(due.id);
    }
  };

  return (
    <View key={id} style={styles.container}>
      <View style={[styles.contentContainer, !asset && styles.rowReverse]}>
        {asset && ( // TODO: (Show service detail if asset is not there and remove row reverse style)
          <PropertyAddressCountry
            primaryAddress={asset.projectName}
            primaryAddressTextStyles={{
              variant: 'text',
              size: 'small',
            }}
            subAddressTextStyles={{
              variant: 'label',
              size: 'large',
            }}
            containerStyle={styles.flexOne}
            countryFlag={asset.country.flag}
            showAddress
            subAddress={asset.formattedAddressWithCity}
          />
        )}
        {onPressClose && (
          <TouchableOpacity onPress={onPressCrossIcon}>
            <Cross />
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.contentContainer, asset && styles.marginTop]}>
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
  },
  marginTop: {
    marginTop: 16,
  },
  dueDetailsContainer: {
    flex: 2,
  },
  dueText: {
    marginBottom: 2,
  },
  flexOne: {
    flex: 1,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
});
