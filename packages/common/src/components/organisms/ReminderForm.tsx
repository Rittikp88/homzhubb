import React, { useState } from 'react';
import { Formik } from 'formik';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import EmailTextInput from '@homzhub/common/src/components/molecules/EmailTextInput';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

// TODO: (Shikha) - Remove After API integration
const frequencyData = [
  { label: 'One-time', value: 'SINGLE' },
  { label: 'Weekly', value: 'WEEKLY' },
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Yearly', value: 'YEARLY' },
];

interface IFormData {
  title: string;
  property: string;
  frequency: string;
  date: string;
}

const initialData = {
  title: '',
  property: '',
  frequency: 'SINGLE', // TODO: (Shikha) - Remove After API integration
  date: DateUtils.getNextDate(1),
};

const ReminderForm = (): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetFinancial);
  const [formData] = useState<IFormData>(initialData);
  const assets = useSelector(UserSelector.getUserAssets);

  const getPropertyList = (): IDropdownOption[] => {
    return assets.map((property: Asset) => {
      return { value: property.id, label: property.formattedProjectName };
    });
  };

  return (
    <Formik initialValues={{ ...formData }} onSubmit={FunctionUtils.noop}>
      {(formProps): React.ReactNode => {
        return (
          <>
            <FormTextInput
              formProps={formProps}
              inputType="default"
              name="title"
              label={t('serviceTickets:title')}
              placeholder={t('reminderTitle')}
            />
            <FormDropdown
              name="category"
              label={t('category')}
              placeholder={t('common:selectYourCountry')}
              options={[]}
              formProps={formProps}
              dropdownContainerStyle={styles.field}
            />
            <FormDropdown
              name="property"
              label={t('property')}
              placeholder={t('offers:selectProperty')}
              options={getPropertyList()}
              formProps={formProps}
              dropdownContainerStyle={styles.field}
            />
            <FormDropdown
              name="leaseUnit"
              label={t('leaseUnit')}
              placeholder={t('selectLeaseUnit')}
              options={[]}
              formProps={formProps}
              dropdownContainerStyle={styles.field}
            />
            <FormCalendar formProps={formProps} name="date" textType="label" label={t('reminderDate')} />
            <FormDropdown
              name="frequency"
              label={t('frequency')}
              listHeight={400}
              options={frequencyData}
              formProps={formProps}
              dropdownContainerStyle={styles.field}
            />
            <EmailTextInput />
            <TextArea value="" placeholder={t('notesPlaceholder')} label={t('notes')} helpText={t('common:optional')} />
            <Divider containerStyles={styles.divider} />
            <FormButton
              formProps={formProps}
              type="primary"
              title={t('common:addNow')}
              containerStyle={styles.button}
            />
          </>
        );
      }}
    </Formik>
  );
};

export default ReminderForm;

const styles = StyleSheet.create({
  field: {
    paddingVertical: 12,
  },
  divider: {
    marginVertical: 20,
    borderColor: theme.colors.darkTint10,
  },
  button: {
    flex: 0.4,
    marginBottom: 16,
  },
});
