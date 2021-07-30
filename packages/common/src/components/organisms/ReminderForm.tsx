import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import EmailTextInput from '@homzhub/common/src/components/molecules/EmailTextInput';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { OnGoingTransaction } from '@homzhub/common/src/domain/models/OnGoingTransaction';
import { IReminderPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IAddReminderPayload, IUpdateReminderPayload } from '@homzhub/common/src/modules/financials/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IOwnProp {
  onSubmit: () => void;
  isEdit?: boolean;
  setLoading?: (isLoading: boolean) => void;
}

interface IFormData {
  title: string;
  property: number;
  frequency: number;
  date: string;
  category: number;
  leaseUnit: number;
}

const initialData = {
  title: '',
  property: 0,
  category: 0,
  leaseUnit: 0,
  frequency: 4, // ONE_TIME id
  date: DateUtils.getNextDate(1),
};

const ReminderForm = ({ onSubmit, isEdit, setLoading }: IOwnProp): React.ReactElement => {
  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetFinancial);
  const assets = useSelector(FinancialSelectors.getReminderAssets);
  const categories = useSelector(FinancialSelectors.getReminderCategories);
  const frequencies = useSelector(FinancialSelectors.getReminderFrequencies);
  const selectedReminderId = useSelector(FinancialSelectors.getCurrentReminderId);

  const [formData, setFormData] = useState<IFormData>(initialData);
  const [unitList, setUnitList] = useState<OnGoingTransaction[]>([]);
  const [userEmails, setUserEmails] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [isEmailError, setEmailError] = useState(false);

  useEffect(() => {
    dispatch(FinancialActions.getReminderCategories());
    dispatch(FinancialActions.getReminderFrequencies());
    dispatch(FinancialActions.getReminderAssets());
    if (isEdit && selectedReminderId > 0) {
      getInitialState();
    }
  }, []);

  useEffect(() => {
    if (formData.property > 0) {
      onChangeProperty(formData.property.toString()).then();
    }
  }, [formData.property]);

  const getInitialState = (): void => {
    if (setLoading) {
      setLoading(true);
    }
    LedgerRepository.getReminderById(selectedReminderId)
      .then((res) => {
        if (setLoading) {
          setLoading(false);
        }
        if (res) {
          setFormData({
            ...formData,
            title: res.title,
            category: res.reminderCategory.id,
            frequency: res.reminderFrequency.id,
            date: DateUtils.getDisplayDate(res.startDate, 'YYYY-MM-DD'),
            ...(res.asset && { property: res.asset.id }),
            ...(res.leaseTransaction && { leaseUnit: res.leaseTransaction.id }),
          });

          setUserEmails(res.emails);
          setNotes(res.description);
        }
      })
      .catch((e) => {
        if (setLoading) {
          setLoading(false);
        }
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
      });
  };

  // DROPDOWN LIST FORMATION START
  const getPropertyList = (isRented: boolean): IDropdownOption[] => {
    const data = isRented ? assets.filter((item) => item.isRented) : assets;
    if (isRented && data.length < 1) {
      AlertHelper.error({ message: t('property:noOccupiedProperty') });
      return [];
    }
    return data.map((property: Asset) => {
      return { value: property.id, label: property.formattedProjectName };
    });
  };

  const getCategoryList = (): IDropdownOption[] => {
    if (categories.length > 0) {
      return categories.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    }

    return [];
  };

  const getFrequencyList = (): IDropdownOption[] => {
    if (frequencies.length > 0) {
      return frequencies.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    }

    return [];
  };

  const getUnitList = (): IDropdownOption[] => {
    if (unitList.length > 0) {
      return unitList.map((item) => {
        return {
          label: item.leaseUnit.name,
          value: item.id,
        };
      });
    }

    return [];
  };

  // DROPDOWN LIST FORMATION END

  const onChangeProperty = async (value: string): Promise<void> => {
    try {
      const list = await AssetRepository.getOnGoingTransaction(Number(value));
      setUnitList(list);
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };

  const onchangeUnit = (value: string): void => {
    const data = unitList.filter((item) => item.id === Number(value))[0];
    const users = data.leaseTenants.map((item) => item.tenantUser?.email ?? '').filter((email) => email !== '');
    setUserEmails(users);
  };

  const formSchema = (): yup.ObjectSchema<IFormData> => {
    return yup.object().shape({
      title: yup.string().required(),
      category: yup.number().required(),
      frequency: yup.number().required(),
      date: yup.string().required(),
      property: yup.number(),
      leaseUnit: yup.number(),
    });
  };

  const handleSubmit = (values: IFormData): void => {
    const { title, category, date, frequency, property, leaseUnit } = values;
    const reminderPayload: IReminderPayload = {
      title,
      reminder_category: category,
      reminder_frequency: frequency,
      start_date: new Date(date).toISOString(),
      emails: userEmails,
      ...(!isEdit && property > 0 && { asset: property }),
      ...(category === 1 && leaseUnit > 0 && { lease_transaction: leaseUnit }),
      ...(!!notes && { description: notes }),
    };
    const finalPayload = {
      ...(isEdit && { id: selectedReminderId }),
      data: reminderPayload,
      onCallback: handleReminderCallback,
    };
    if (isEdit) {
      dispatch(FinancialActions.updateReminder(finalPayload as IUpdateReminderPayload));
    } else {
      dispatch(FinancialActions.addReminder(finalPayload as IAddReminderPayload));
    }
  };

  const handleReminderCallback = (status: boolean): void => {
    if (status) {
      AlertHelper.success({ message: t(isEdit ? 'reminderUpdateMsg' : 'reminderSuccessMsg') });
      onSubmit();
    }
  };

  return (
    <Formik
      initialValues={{ ...formData }}
      onSubmit={handleSubmit}
      validate={FormUtils.validate(formSchema)}
      enableReinitialize
    >
      {(formProps): React.ReactNode => {
        const { title, category, frequency } = formProps.values;
        const isEnable = !!title && Number(category) > 0 && Number(frequency) > 0 && !isEmailError;
        const isRented = Number(formProps.values.category) === 1;
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
              options={getCategoryList()}
              formProps={formProps}
              listHeight={250}
              isDisabled={isEdit}
              dropdownContainerStyle={styles.field}
            />
            <FormDropdown
              name="property"
              label={t('property')}
              placeholder={t('offers:selectProperty')}
              options={getPropertyList(isRented)}
              formProps={formProps}
              onChange={onChangeProperty}
              isDisabled={getPropertyList(isRented).length < 1 || isEdit}
              dropdownContainerStyle={styles.field}
            />
            {Number(formProps.values.category) === 1 && ( // For RENT category only
              <FormDropdown
                name="leaseUnit"
                label={t('leaseUnit')}
                placeholder={t('selectLeaseUnit')}
                options={getUnitList()}
                formProps={formProps}
                onChange={onchangeUnit}
                isDisabled={getUnitList().length < 1}
                dropdownContainerStyle={styles.field}
              />
            )}
            <FormCalendar
              formProps={formProps}
              name="date"
              textType="label"
              minDate={formProps.values.date}
              label={t('reminderDate')}
              isCurrentDateEnable={false}
            />
            <FormDropdown
              name="frequency"
              label={t('frequency')}
              listHeight={400}
              options={getFrequencyList()}
              formProps={formProps}
              dropdownContainerStyle={styles.field}
            />
            <EmailTextInput data={userEmails} onSetEmails={setUserEmails} setEmailError={setEmailError} />
            <TextArea
              value={notes}
              placeholder={t('notesPlaceholder')}
              label={t('notes')}
              helpText={t('common:optional')}
              onMessageChange={setNotes}
            />
            <Divider containerStyles={styles.divider} />
            <FormButton
              // @ts-ignore
              onPress={formProps.handleSubmit}
              formProps={formProps}
              type="primary"
              disabled={!isEnable}
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
    marginBottom: 16,
  },
});
