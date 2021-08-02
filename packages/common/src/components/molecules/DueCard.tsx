import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { DateFormats, DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { CommonSelectors } from '@homzhub/common/src/modules/common/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Cross from '@homzhub/common/src/assets/images/circularCross.svg';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { flags } from '@homzhub/common/src/components/atoms/Flag';
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
  const { id, invoiceTitle, asset, totalDue, dueDate, isOverDue, createdAt, dueTitle, currency } = due;

  const { t } = useTranslation();
  const countries = useSelector(CommonSelectors.getCountryList);

  const onPressCrossIcon = (): void => {
    if (onPressClose) {
      onPressClose(due.id);
    }
  };

  const getFlag = (): React.ReactElement => {
    if (asset) return asset.country.flag;
    const dueCurrency = countries.find((item) => item.currencies.find((i) => i.currencyCode === currency.currencyCode));
    // @ts-ignore
    return flags[dueCurrency?.iso2Code ?? ''];
  };

  return (
    <View key={id} style={styles.container}>
      <View style={styles.contentContainer}>
        <PropertyAddressCountry
          primaryAddress={asset ? asset.projectName : dueTitle}
          primaryAddressTextStyles={{
            variant: 'text',
            size: 'small',
          }}
          subAddressTextStyles={{
            variant: 'label',
            size: 'large',
          }}
          containerStyle={styles.flexOne}
          countryFlag={getFlag()}
          showAddress
          subAddress={asset ? asset.formattedAddressWithCity : undefined}
        />
        {onPressClose && (
          <TouchableOpacity onPress={onPressCrossIcon}>
            <Cross />
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.contentContainer, styles.marginTop]}>
        <View style={styles.dueDetailsContainer}>
          <Label type="large" style={[styles.categoryText]}>
            {invoiceTitle}
          </Label>
          <Label type="regular" style={styles.createdDate}>
            {DateUtils.getDisplayDate(createdAt, DateFormats.DoMMMYYYY)}
          </Label>
        </View>
        <Text textType="semiBold" type="small">
          {totalDue}
        </Text>
      </View>
      <View style={[styles.contentContainer, styles.marginTop]}>
        <View style={styles.bottomContainer}>
          <Icon
            name={icons.timer}
            size={30}
            color={isOverDue ? theme.colors.error : theme.colors.darkTint5}
            style={styles.icon}
          />
          <View>
            <Label
              type="regular"
              style={isOverDue ? styles.error : styles.dark}
              textType={isOverDue ? 'bold' : 'semiBold'}
            >
              {t(isOverDue ? 'assetFinancial:overdue' : 'assetFinancial:dueBy')}
            </Label>
            <Label
              type="regular"
              style={isOverDue ? styles.error : styles.dark}
              textType={isOverDue ? 'bold' : 'semiBold'}
            >
              {DateUtils.getDisplayDate(dueDate, DateFormats.DoMMMYYYY)}
            </Label>
          </View>
        </View>
        <PaymentGateway
          title={t('assetFinancial:payNow')}
          type="primary"
          initiatePayment={onInitPayment}
          outerContainerStyle={[styles.paymentButton, isOverDue && styles.redBackground]}
          paymentApi={onOrderPlaced}
          textStyle={styles.buttonText}
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
    marginTop: 3,
    marginHorizontal: 0,
    height: 35,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  error: {
    color: theme.colors.error,
  },
  categoryText: {
    color: theme.colors.darkTint3,
  },
  createdDate: {
    color: theme.colors.darkTint6,
  },
  bottomContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginEnd: 10,
  },
  dark: {
    color: theme.colors.darkTint5,
  },
  redBackground: {
    backgroundColor: theme.colors.error,
  },
  buttonText: {
    marginVertical: 0,
  },
});
