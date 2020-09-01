import React, { ReactElement } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikActions, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
import { LedgerService } from '@homzhub/common/src/services/LedgerService';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { icons } from '@homzhub/common/src/assets/icon';
import {
  FormButton,
  FormDropdown,
  FormTextInput,
  IDropdownOption,
  SelectionPicker,
  UploadBox,
} from '@homzhub/common/src/components';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { LedgerCategory } from '@homzhub/common/src/domain/models/LedgerCategory';

enum FormType {
  Income = 1,
  Expense = 2,
}

interface IFormData {
  property: string;
  details: string;
  tellerName?: string;
  amount: string;
  category: string;
  date: string;
  notes?: string;
}

interface IState {
  selectedFormType: FormType;
  wordCount: number;
  formValues: IFormData;
}

interface IOwnProps extends WithTranslation {
  properties: Asset[];
  ledgerCategories: LedgerCategory[];
  onSubmitFormSuccess?: () => void;
  clear: boolean;
  onFormClear: () => void;
  containerStyles?: StyleProp<ViewStyle>;
  testID?: string;
}

const MAX_WORD_COUNT = 200;

class AddRecordForm extends React.PureComponent<IOwnProps, IState> {
  private resetForm: ((nextValues?: FormikValues) => void) | undefined;

  public state = {
    selectedFormType: FormType.Income,
    wordCount: MAX_WORD_COUNT,
    formValues: {
      property: '',
      details: '',
      tellerName: '',
      amount: '',
      category: '',
      date: '',
      notes: '',
    },
  };

  public render(): ReactElement {
    const { containerStyles, t, clear } = this.props;
    const { selectedFormType, formValues, wordCount } = this.state;

    if (clear) {
      this.clearForm();
    }
    // @ts-ignore
    return (
      <View style={containerStyles}>
        <SelectionPicker
          data={[
            { title: t('income'), value: FormType.Income },
            { title: t('expense'), value: FormType.Expense },
          ]}
          selectedItem={[selectedFormType]}
          onValueChange={this.onFormTypeChange}
        />
        <Formik
          onSubmit={this.handleSubmit}
          initialValues={formValues}
          validate={FormUtils.validate(this.formSchema)}
          enableReinitialize
        >
          {(formProps: FormikProps<FormikValues>): React.ReactNode => {
            this.initializeReset(formProps);

            return (
              <>
                <FormDropdown
                  formProps={formProps}
                  name="property"
                  options={this.loadPropertyNames()}
                  placeholder={t('selectProperty')}
                  maxLabelLength={36}
                />
                <FormTextInput
                  formProps={formProps}
                  inputType="default"
                  name="details"
                  label={t('details')}
                  placeholder={t('detailsPlaceholder')}
                />
                <FormTextInput
                  isOptional
                  formProps={formProps}
                  inputType="default"
                  name="tellerName"
                  label={selectedFormType === FormType.Income ? t('receivedFrom') : t('paidTo')}
                  placeholder={t('tellerPlaceholder')}
                />
                <FormTextInput
                  formProps={formProps}
                  inputType="number"
                  name="amount"
                  label={t('amount')}
                  placeholder={t('amountPlaceholder')}
                  inputPrefixText="₹"
                  inputGroupSuffixText="INR"
                />
                <FormDropdown
                  formProps={formProps}
                  name="category"
                  label={t('category')}
                  options={this.loadCategories()}
                  placeholder={t('categoryPlaceholder')}
                  maxLabelLength={36}
                />
                <FormCalendar
                  allowPastDates
                  formProps={formProps}
                  name="date"
                  label={t('addDate')}
                  placeHolder={t('addDatePlaceholder')}
                />
                <FormTextInput
                  isOptional
                  formProps={formProps}
                  inputType="default"
                  name="notes"
                  label={t('notes')}
                  placeholder={t('notesPlaceholder')}
                  style={styles.inputStyle}
                  helpText={t('charactersRemaining', { wordCount })}
                  onValueChange={this.wordCount}
                  multiline
                  maxLength={MAX_WORD_COUNT}
                />
                <UploadBox
                  icon={icons.document}
                  header={t('common:uploadDocument')}
                  subHeader={t('common:uploadDocHelperText')}
                  onPress={this.handleUpload}
                  containerStyle={styles.uploadBox}
                />
                <FormButton
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  formProps={formProps}
                  type="primary"
                  title={t('addNow')}
                />
              </>
            );
          }}
        </Formik>
      </View>
    );
  }

  private onFormTypeChange = (selectedType: number): void => {
    this.setState({ selectedFormType: selectedType });
  };

  private initializeReset = (formProps: FormikProps<FormikValues>): void => {
    if (!this.resetForm) {
      this.resetForm = formProps.resetForm;
    }
  };

  private clearForm = (): void => {
    const { onFormClear } = this.props;

    if (this.resetForm && onFormClear) {
      this.resetForm();
      onFormClear();
    }
  };

  private loadPropertyNames = (): IDropdownOption[] => {
    const { properties } = this.props;

    return properties.map((property: Asset) => {
      return { value: property.id, label: property.projectName };
    });
  };

  private loadCategories = (): IDropdownOption[] => {
    const { ledgerCategories } = this.props;
    const { selectedFormType } = this.state;
    const entryType = selectedFormType === FormType.Income ? LedgerTypes.credit : LedgerTypes.debit;

    return LedgerUtils.filterLegerCategoryOn(entryType, ledgerCategories).map((category: LedgerCategory) => {
      return { value: category.id, label: category.name };
    });
  };

  private formSchema = (): yup.ObjectSchema<IFormData> => {
    const { t } = this.props;

    return yup.object().shape({
      property: yup.string().required(t('propertyError')),
      details: yup.string().required(t('detailsError')),
      tellerName: yup.string().optional(),
      amount: yup.string().required(t('amountError')),
      category: yup.string().required(t('categoryError')),
      date: yup.string().required(t('dateError')),
      notes: yup.string().optional(),
    });
  };

  private wordCount = (value: string): void => {
    const { wordCount } = this.state;

    this.setState(() => ({
      wordCount: wordCount === 0 ? 0 : MAX_WORD_COUNT - value.length,
    }));
  };

  private handleUpload = (): void => {
    /* Write Upload logic here */
  };

  private handleSubmit = async (values: FormikValues, formActions: FormikActions<FormikValues>): Promise<void> => {
    const { property, details, tellerName, amount, category, date, notes } = values;
    const { selectedFormType } = this.state;

    formActions.setSubmitting(true);

    const tellerInfo =
      selectedFormType === FormType.Income ? { payer_name: tellerName } : { receiver_name: tellerName };

    const payload = {
      asset: property,
      entry_type: selectedFormType === FormType.Income ? LedgerTypes.credit : LedgerTypes.debit,
      detail: details,
      ...tellerInfo,
      amount,
      category,
      transaction_date: date,
      ...(notes && { notes }),
      /* Todo (Sriram- 2020.08.31) Add a attachment ID */
      attachment: null,
    };

    try {
      await LedgerService.postGeneralLedgers(payload);
      formActions.setSubmitting(false);

      const { onSubmitFormSuccess } = this.props;
      if (onSubmitFormSuccess) {
        onSubmitFormSuccess();
      }
    } catch (e) {
      formActions.setSubmitting(false);
      formActions.resetForm({});
      AlertHelper.error({ message: e.message });
    }
  };
}

const namespace = LocaleConstants.namespacesKey;
const addRecordForm = withTranslation([namespace.assetFinancial, namespace.common])(AddRecordForm);
export { addRecordForm as AddRecordForm };

const styles = StyleSheet.create({
  inputStyle: {
    height: 100,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  uploadBox: {
    marginVertical: 24,
  },
});
