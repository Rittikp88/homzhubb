import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormikProps, FormikValues } from 'formik';
import { FormTextInput, FormDropdown } from '@homzhub/common/src/components';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { ScheduleTypes } from '@homzhub/common/src/domain/models/LeaseTerms';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  formProps: FormikProps<FormikValues>;
  currency: Currency;
  maintenanceAmountKey: string;
  maintenanceScheduleKey: string;
  onMaintenanceAmountChanged?: (value: string) => void;
  onMaintenanceScheduleChanged?: (value: ScheduleTypes) => void;
}

export const MaintenanceDetails = (props: IProps): React.ReactElement => {
  const [t] = useTranslation(LocaleConstants.namespacesKey.property);
  const {
    formProps,
    currency,
    maintenanceAmountKey,
    maintenanceScheduleKey,
    onMaintenanceAmountChanged,
    onMaintenanceScheduleChanged,
  } = props;

  const scheduleOptions = [
    { label: t('monthly'), value: ScheduleTypes.MONTHLY },
    { label: t('quarterly'), value: ScheduleTypes.QUARTERLY },
    { label: t('annually'), value: ScheduleTypes.ANNUALLY },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.fieldContainer}>
        <FormTextInput
          inputType="number"
          name={maintenanceAmountKey}
          label={t('maintenanceAmount')}
          placeholder={t('maintenanceAmountPlaceholder')}
          maxLength={formProps.values.maintenanceAmount && formProps.values.maintenanceAmount.includes('.') ? 13 : 12}
          formProps={formProps}
          inputPrefixText={currency.currencySymbol}
          inputGroupSuffixText={currency.currencyCode}
          onValueChange={onMaintenanceAmountChanged}
        />
      </View>
      <View style={styles.dropdownContainer}>
        <FormDropdown
          label={t('maintenanceSchedule')}
          listTitle={t('maintenanceSchedule')}
          listHeight={300}
          name={maintenanceScheduleKey}
          options={scheduleOptions}
          formProps={formProps}
          // @ts-ignore
          onChange={onMaintenanceScheduleChanged}
          dropdownContainerStyle={styles.dropdownContainerStyle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 4,
    flexDirection: 'row',
    marginBottom: 24,
  },
  fieldContainer: {
    flex: 0.5,
  },
  dropdownContainer: {
    flex: 0.5,
    marginStart: 16,
  },
  dropdownContainerStyle: {
    height: 48,
  },
});
