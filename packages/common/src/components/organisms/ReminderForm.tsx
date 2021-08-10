import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Formik, FormikProps, FormikValues } from 'formik';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { TransactionField } from '@homzhub/common/src/components/molecules/TransactionField';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import EmailTextInput from '@homzhub/common/src/components/molecules/EmailTextInput';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { OnGoingTransaction } from '@homzhub/common/src/domain/models/OnGoingTransaction';
import { IReminderPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IAddReminderPayload, IUpdateReminderPayload } from '@homzhub/common/src/modules/financials/interfaces';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IOwnProp {
  onSubmit: () => void;
  onAddAccount?: () => void;
  isEdit?: boolean;
  isFromDues?: boolean;
  setLoading?: (isLoading: boolean) => void;
  setShowDeleteIcon?: (showDeleteIcon: boolean) => void;
}

interface IFormData {
  title: string;
  property: number;
  frequency: number;
  date: string;
  category: number;
  leaseUnit: number;
  rent: string;
  bankAccount: number;
  owner: number;
  tenant: number;
}

const initialData: IFormData = {
  title: '',
  property: -1,
  category: 2,
  leaseUnit: -1,
  frequency: 4, // ONE_TIME id
  date: DateUtils.getNextDate(1),
  rent: '',
  bankAccount: -1,
  owner: -1,
  tenant: -1,
};

// TODO: (Shikha) - Do cleanup to reduce number of lines

const ReminderForm = (props: IOwnProp): React.ReactElement => {
  const { onSubmit, isEdit = false, setLoading, isFromDues = false, onAddAccount, setShowDeleteIcon } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.assetFinancial);
  const assets = useSelector(FinancialSelectors.getReminderAssets);
  const categories = useSelector(FinancialSelectors.getReminderCategories);
  const frequencies = useSelector(FinancialSelectors.getReminderFrequencies);
  const selectedReminderId = useSelector(FinancialSelectors.getCurrentReminderId);
  const selectedDue = useSelector(FinancialSelectors.getCurrentDue);
  const assetUsers = useSelector(AssetSelectors.getAssetUser);
  const emails = useSelector(AssetSelectors.getAssetUserEmails);
  const bankInfo = useSelector(UserSelector.getBankInfo);

  const [formData, setFormData] = useState<IFormData>(initialData);
  const [unitList, setUnitList] = useState<OnGoingTransaction[]>([]);
  const [userEmails, setUserEmails] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [emailError, setEmailErrorText] = useState<string>('');
  const [isEmailError, setEmailError] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  const [currency, setCurrency] = useState('');

  useEffect(() => {
    dispatch(FinancialActions.getReminderCategories());
    dispatch(FinancialActions.getReminderFrequencies());
    dispatch(FinancialActions.getReminderAssets());
    dispatch(UserActions.getBankInfo());
    if (isEdit && selectedReminderId > 0) {
      getInitialState();
    }
    if (isFromDues) {
      getDueState();
    }
  }, []);

  useEffect(() => {
    if (formData.property > 0) {
      onChangeProperty(formData.property.toString(), formData.category).then();
    }
  }, [formData.property]);

  useEffect(() => {
    if (userEmails.length > 0) {
      userEmails.forEach((item) => {
        if (!emails.includes(item)) {
          setEmailErrorText('property:userNotAssociated');
          setEmailError(true);
        }
      });
    }
  }, [assetUsers]);

  const getDueState = (): void => {
    // TODO: (Shikha) - Handle RENT case once BE done
    if (selectedDue) {
      setFormData({
        ...formData,
        title: selectedDue.invoiceTitle,
        category: 2,
        date: DateUtils.getDisplayDate(selectedDue.dueDate, 'YYYY-MM-DD'),
        ...(selectedDue.asset && { property: selectedDue.asset.id }),
      });
    }
  };

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
            ...(res.amount && { rent: res.amount.toString() }),
            ...(res.receiverUser && { owner: res.receiverUser.id }),
            ...(res.payerUser && { tenant: res.payerUser.id }),
            ...(res.userBankInfo && { bankAccount: res.userBankInfo.id }),
          });

          setUserEmails(res.emails);
          setNotes(res.description);
          setCanEdit(res.canEdit);
          if (setShowDeleteIcon) {
            setShowDeleteIcon(res.canDelete);
          }
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
          label: item.name,
          value: item.leaseTransaction.id,
        };
      });
    }

    return [];
  };

  // DROPDOWN LIST FORMATION END

  const onChangeProperty = async (
    value: string,
    category: number,
    formProp?: FormikProps<FormikValues>
  ): Promise<void> => {
    try {
      const list = await AssetRepository.getOnGoingTransaction(Number(value));
      setUnitList(list);
      if (formProp) {
        formProp.setFieldValue('owner', -1);
        formProp.setFieldValue('tenant', -1);
      }
      dispatch(AssetActions.getAssetUsers({ assetId: Number(value) }));
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };

  const onChangeUnit = (value: string, formProps?: FormikProps<FormikValues>): void => {
    if (formProps) {
      const { values, setFieldValue } = formProps;
      const lease = unitList.filter((item) => item.leaseTransaction.id === Number(value))[0].leaseTransaction;
      setFieldValue('rent', lease.rent.toString());
      setCurrency(lease.currency.currencyCode);
      dispatch(AssetActions.getAssetUsers({ assetId: values.property, lease_transaction_id: Number(value) }));
    }
  };

  const onChangeCategory = (value: string, formProps?: FormikProps<FormikValues>): void => {
    if (formProps) {
      formProps.setFieldValue('leaseUnit', -1);
      setUserEmails([]);
      if (Number(value) === 1) {
        formProps.setFieldValue('frequency', 1);
      }
    }
  };

  const onSetEmails = (value: string[]): void => {
    if (emails.length > 0) {
      value.forEach((item) => {
        if (emails.includes(item.toLowerCase())) {
          setUserEmails([...userEmails, item]);
        } else {
          setEmailErrorText('property:userNotAssociated');
          setEmailError(true);
        }
      });
    } else {
      setUserEmails(value);
    }
  };

  const onSetEmailError = (value: boolean): void => {
    if (!value && !!emailError) {
      setEmailErrorText('');
    }
    setEmailError(value);
  };

  const formSchema = (): yup.ObjectSchema<IFormData> => {
    return yup.object().shape({
      title: yup.string().required(),
      category: yup.number().required(),
      frequency: yup.number().required(),
      date: yup.string().required(),
      property: yup.number(),
      leaseUnit: yup.number().when('category', {
        is: 1,
        then: yup.number().required(),
      }),
      tenant: yup.number().when('category', {
        is: 1,
        then: yup.number().required(),
      }),
      owner: yup.number().when('category', {
        is: 1,
        then: yup.number().required(),
      }),
      bankAccount: yup.number().when('category', {
        is: 1,
        then: yup.number().required(),
      }),
      rent: yup.string().when('category', {
        is: 1,
        then: yup.string().required(),
      }),
    });
  };

  const handleSubmit = (values: IFormData): void => {
    const { title, category, date, frequency, property, leaseUnit, owner, tenant, rent, bankAccount } = values;
    const isRent = category === 1;
    const reminderPayload: IReminderPayload = {
      title,
      reminder_category: category,
      reminder_frequency: frequency,
      start_date: new Date(date).toISOString(),
      emails: userEmails,
      ...(!isEdit && property > 0 && { asset: property }),
      ...(isRent && leaseUnit > 0 && { lease_transaction: leaseUnit }),
      ...(!!notes && { description: notes }),
      ...(isRent && { payer_user: tenant }),
      ...(isRent && { receiver_user: owner }),
      ...(isRent && { user_bank_info: bankAccount }),
      ...(isRent && { amount: Number(rent) }),
      ...(isRent && { currency }),
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

  const renderRightNode = (): React.ReactElement => {
    return (
      <TouchableOpacity style={styles.rightNode} onPress={onAddAccount}>
        <Icon name={icons.plus} color={theme.colors.primaryColor} size={20} />
        <Label textType="semiBold" style={styles.rightText}>
          {t('addNew')}
        </Label>
      </TouchableOpacity>
    );
  };

  return (
    <Formik
      initialValues={{ ...formData }}
      onSubmit={handleSubmit}
      validate={FormUtils.validate(formSchema)}
      enableReinitialize
    >
      {(formProps): React.ReactNode => {
        const { title, category, frequency, bankAccount } = formProps.values;
        const isEnable =
          !!title && Number(category) > 0 && Number(frequency) > 0 && !emailError && !isEmailError && bankAccount > 0;
        const isRented = Number(formProps.values.category) === 1;

        return (
          <>
            <FormTextInput
              formProps={formProps}
              inputType="default"
              name="title"
              label={t('serviceTickets:title')}
              placeholder={t('reminderTitle')}
              editable={canEdit}
            />
            <FormDropdown
              name="category"
              label={t('category')}
              placeholder={t('common:selectYourCountry')}
              options={getCategoryList()}
              onChange={onChangeCategory}
              formProps={formProps}
              listHeight={250}
              isDisabled={isEdit || !canEdit}
              dropdownContainerStyle={styles.field}
            />
            <FormDropdown
              name="property"
              label={t('property')}
              placeholder={t('offers:selectProperty')}
              options={getPropertyList(isRented)}
              formProps={formProps}
              onChange={(value, formProp): Promise<void> => onChangeProperty(value, category, formProp)}
              isDisabled={getPropertyList(isRented).length < 1 || isEdit || !canEdit}
              dropdownContainerStyle={styles.field}
            />
            {Number(formProps.values.category) === 1 && ( // For RENT category only
              <>
                <FormDropdown
                  name="leaseUnit"
                  label={t('leaseUnit')}
                  placeholder={t('selectLeaseUnit')}
                  options={getUnitList()}
                  formProps={formProps}
                  onChange={onChangeUnit}
                  isDisabled={getUnitList().length < 1 || !canEdit}
                  dropdownContainerStyle={styles.field}
                />
                <FormDropdown
                  name="owner"
                  label={t('property:owner')}
                  placeholder={t('property:selectOwner')}
                  options={assetUsers?.owners ?? []}
                  formProps={formProps}
                  isDisabled={Number(formProps.values.leaseUnit) < 1 || !canEdit}
                  dropdownContainerStyle={styles.field}
                  listHeight={300}
                />
                <FormDropdown
                  name="tenant"
                  label={t('property:tenant')}
                  placeholder={t('property:selectTenant')}
                  options={assetUsers?.tenants ?? []}
                  formProps={formProps}
                  isDisabled={Number(formProps.values.leaseUnit) < 1 || !canEdit || !assetUsers?.tenants.length}
                  dropdownContainerStyle={styles.field}
                  listHeight={300}
                />
                <FormTextInput
                  name="rent"
                  inputType="decimal"
                  label={t('property:rent')}
                  formProps={formProps}
                  placeholder={t('property:enterRentAmount')}
                  editable={canEdit}
                />
                <TransactionField
                  name="bankAccount"
                  label={t('bankAccount')}
                  placeholder={t('selectAccount')}
                  rightNode={renderRightNode()}
                  formProps={formProps}
                  options={bankInfo.map((item) => item.bankDetail)}
                />
              </>
            )}
            <FormCalendar
              formProps={formProps}
              name="date"
              textType="label"
              minDate={formProps.values.date}
              label={t('reminderDate')}
              isCurrentDateEnable={false}
              isDisabled={!canEdit}
            />
            <FormDropdown
              name="frequency"
              label={t('frequency')}
              listHeight={400}
              options={getFrequencyList()}
              formProps={formProps}
              dropdownContainerStyle={styles.field}
              isDisabled={!canEdit}
            />
            <EmailTextInput
              data={userEmails}
              onSetEmails={onSetEmails}
              setEmailError={onSetEmailError}
              isDisabled={!canEdit}
              errorText={emailError}
            />
            <TextArea
              value={notes}
              placeholder={t('notesPlaceholder')}
              label={t('notes')}
              helpText={t('common:optional')}
              onMessageChange={setNotes}
              isDisabled={canEdit}
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
  rightNode: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    color: theme.colors.primaryColor,
  },
});
