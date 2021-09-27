import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Formik, FormikProps, FormikValues } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { PropertyPaymentActions } from '@homzhub/common/src/modules/propertyPayment/actions';
import { TicketActions } from '@homzhub/common/src/modules/tickets/actions';
import { PropertyPaymentSelector } from '@homzhub/common/src/modules/propertyPayment/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { RNCheckbox } from '@homzhub/common/src/components/atoms/Checkbox';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { ISelectionPicker, SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { InvoiceActions } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  handlePayNow: () => void;
}

const SocietyPayment = ({ handlePayNow }: IProps): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const asset = useSelector(PropertyPaymentSelector.getSelectedAsset);
  const user = useSelector(UserSelector.getUserProfile);
  const societyCharges = useSelector(PropertyPaymentSelector.getSocietyCharges);
  const [selectedMonth, setSelectedMonth] = useState(DateUtils.getMonth());
  const [isNotify, setNotify] = useState(false);
  const [selectedUser, setSelectedUser] = useState(user.id);
  const [formData, setFormData] = useState({
    amount: '',
  });

  useEffect(() => {
    dispatch(PropertyPaymentActions.getSocietyCharges(asset.id));
  }, []);

  useEffect(() => {
    if (societyCharges) {
      setFormData({ amount: societyCharges.maintenance.amount.toString() });
    }
  }, [societyCharges]);

  const getMonthData = (): ISelectionPicker<string>[] => {
    const { getMonth, getPreviousMonth, getNextMonth } = DateUtils;
    return [
      { title: getPreviousMonth(), value: getPreviousMonth() },
      { title: getMonth(), value: getMonth() },
      { title: getNextMonth(), value: getNextMonth() },
    ];
  };

  const handleAmountChange = (value: string): void => {
    setFormData({ amount: value });
  };

  const onPayNow = (): void => {
    if (societyCharges) {
      dispatch(
        TicketActions.getInvoiceSummary({
          action: InvoiceActions.SOCIETY_MAINTENANCE_INVOICE,
          payload: {
            asset: asset.id,
            amount: Number(formData.amount),
            paid_by: selectedUser,
            currency: societyCharges.maintenance.currency.currencyCode,
          },
        })
      );

      handlePayNow();
    }
  };

  const renderUser = (): React.ReactElement | null => {
    if (!societyCharges) return null;
    return (
      <View style={styles.userContainer}>
        <Label type="large" textType="semiBold" style={styles.label}>
          {t('propertyPayment:paidBy')}
        </Label>
        <FlatList
          data={societyCharges.users}
          numColumns={2}
          contentContainerStyle={styles.userList}
          renderItem={({ item }): React.ReactElement => {
            const isSelected = item.id === selectedUser;
            return (
              <TouchableOpacity key={item.id} onPress={(): void => setSelectedUser(item.id)}>
                <Avatar
                  isOnlyAvatar
                  fullName={item.fullName}
                  imageSize={80}
                  isSelected={isSelected}
                  image={item.profilePicture}
                  initialsContainerStyle={isSelected && { borderColor: theme.colors.primaryColor }}
                />
                <Label
                  style={[styles.name, { color: isSelected ? theme.colors.primaryColor : theme.colors.darkTint3 }]}
                >
                  {item.fullName}
                </Label>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };
  if (!societyCharges) return <EmptyState />;
  const {
    maintenance: { currency },
  } = societyCharges;
  return (
    <View style={styles.container}>
      <Formik initialValues={formData} enableReinitialize onSubmit={FunctionUtils.noop}>
        {(formProps: FormikProps<FormikValues>): React.ReactElement => {
          return (
            <>
              <FormTextInput
                formProps={formProps}
                inputType="number"
                name="amount"
                labelTextType="large"
                fontWeightType="semiBold"
                label={t('propertyPayment:amountPaid')}
                inputPrefixText={currency.currencySymbol}
                inputGroupSuffixText={currency.currencyCode}
                onValueChange={handleAmountChange}
              />
              {renderUser()}
              <Label textType="semiBold" type="large" style={styles.label}>
                {t('propertyPayment:selectMonth')}
              </Label>
              <SelectionPicker data={getMonthData()} selectedItem={[selectedMonth]} onValueChange={setSelectedMonth} />
              <RNCheckbox
                selected={isNotify}
                containerStyle={styles.checkbox}
                onToggle={(): void => setNotify(!isNotify)}
                labelType="regular"
                label={t('propertyPayment:notifyMe')}
              />
              <View style={styles.buttonContainer}>
                <Button type="secondary" title={t('assetFinancial:setReminder')} disabled={isNotify} />
                <View style={styles.buttonSeparator} />
                <Button type="primary" title={t('assetFinancial:payNow')} onPress={onPayNow} />
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default SocietyPayment;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: theme.colors.white,
    paddingBottom: 16,
  },
  label: {
    marginBottom: 16,
    color: theme.colors.darkTint3,
  },
  checkbox: {
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 40,
  },
  userContainer: {
    marginVertical: 16,
  },
  userList: {
    marginHorizontal: 20,
  },
  name: {
    marginVertical: 12,
    marginLeft: 12,
  },
  buttonSeparator: {
    marginHorizontal: 10,
  },
});
