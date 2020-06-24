import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormikProps, FormikValues } from 'formik';
import { FormTextInput, FormDropdown } from '@homzhub/common/src/components';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { ScheduleTypes } from '@homzhub/common/src/domain/models/LeaseTerms';

interface IProps {
  formProps: FormikProps<FormikValues>;
  currency: string;
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
          maxLength={12}
          formProps={formProps}
          inputGroupSuffixText={currency}
          onChangeText={onMaintenanceAmountChanged}
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
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 12,
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
});
