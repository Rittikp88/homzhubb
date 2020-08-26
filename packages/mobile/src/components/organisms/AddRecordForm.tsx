import React, { ReactElement } from 'react';
import { StyleSheet, StyleProp, View, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { icons } from '@homzhub/common/src/assets/icon';
import { FormButton, FormDropdown, FormTextInput, SelectionPicker, UploadBox } from '@homzhub/common/src/components';
import { FormCalendar } from '@homzhub/common/src/components/molecules/FormCalendar';

enum FormType {
  Income = 1,
  Expense = 2,
}

interface IFormData {
  property: string;
  details: string;
  amount: string;
  category: string;
  date: string;
  notes?: string;
}

interface IOwnProps extends WithTranslation {
  containerStyles?: StyleProp<ViewStyle>;
  testID?: string;
  // Todo (Sriram- 2020.08.25) Add an interface in place of type any
  onSubmitFormSuccess?: (payload: any) => void;
}

interface IState {
  selectedFormType: FormType;
  wordCount: number;
  formValues: IFormData;
}

const MAX_WORD_COUNT = 200;

class AddRecordForm extends React.PureComponent<IOwnProps, IState> {
  public state = {
    selectedFormType: FormType.Income,
    wordCount: MAX_WORD_COUNT,
    formValues: {
      property: '',
      details: '',
      amount: '',
      category: '',
      date: '',
      notes: '',
    },
  };

  public render(): ReactElement {
    const { containerStyles, t } = this.props;
    const { selectedFormType, formValues, wordCount } = this.state;

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
        <Formik onSubmit={this.handleSubmit} initialValues={formValues} validate={FormUtils.validate(this.formSchema)}>
          {(formProps: FormikProps<FormikValues>): React.ReactNode => {
            return (
              <>
                <FormDropdown
                  formProps={formProps}
                  name="property"
                  options={[
                    { value: 'Property 1', label: 'Property 1' },
                    { value: 'Property 2', label: 'Property 2' },
                  ]}
                  placeholder={t('selectProperty')}
                />
                <FormTextInput
                  formProps={formProps}
                  inputType="default"
                  name="details"
                  label={t('details')}
                  placeholder={t('detailsPlaceholder')}
                />
                <FormTextInput
                  formProps={formProps}
                  inputType="default"
                  name="amount"
                  label={t('amount')}
                  placeholder={t('amountPlaceholder')}
                  inputGroupSuffixText="INR"
                />
                <FormDropdown
                  formProps={formProps}
                  name="category"
                  label={t('category')}
                  options={[
                    { value: 'Category 1', label: 'Category 1' },
                    { value: 'Category 2', label: 'Category 2' },
                  ]}
                  placeholder={t('categoryPlaceholder')}
                />
                <FormCalendar
                  formProps={formProps}
                  name="date"
                  label={t('addDate')}
                  placeHolder={t('addDatePlaceholder')}
                />
                <FormTextInput
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

  private formSchema = (): yup.ObjectSchema<IFormData> => {
    const { t } = this.props;

    return yup.object().shape({
      property: yup.string().required(t('propertyError')),
      details: yup.string().required(t('detailsError')),
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

  private handleSubmit = (values: FormikValues): void => {
    /* handle submit logic here */
  };
}

const namespace = LocaleConstants.namespacesKey;
const addRecordForm = withTranslation([namespace.assetFinancial, namespace.common])(AddRecordForm);
export { addRecordForm as AddRecordForm };

const styles = StyleSheet.create({
  inputStyle: {
    height: 100,
  },
  uploadBox: {
    marginVertical: 24,
  },
});
