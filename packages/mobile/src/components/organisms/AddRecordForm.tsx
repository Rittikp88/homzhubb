import React, { ReactElement } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { LedgerUtils } from '@homzhub/common/src/utils/LedgerUtils';
import { AttachmentService, AttachmentType } from '@homzhub/common/src/services/AttachmentService';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormCalendar } from '@homzhub/mobile/src/components/molecules/FormCalendar';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { IDocumentSource, UploadBoxComponent } from '@homzhub/mobile/src/components/molecules/UploadBoxComponent';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Currency } from '@homzhub/common/src/domain/models/Currency';
import { LedgerTypes } from '@homzhub/common/src/domain/models/GeneralLedgers';
import { LedgerCategory } from '@homzhub/common/src/domain/models/LedgerCategory';

enum FormType {
  Income = 1,
  Expense = 2,
}

interface IFormData {
  property: number;
  label: string;
  tellerName?: string;
  amount: string;
  category: string;
  date: string;
  notes?: string;
}

interface IState {
  ledgerCategories: LedgerCategory[];
  selectedFormType: FormType;
  formValues: IFormData;
  attachment?: IDocumentSource;
  currencyCode: string;
  currencySymbol: string;
}

interface IOwnProps extends WithTranslation {
  properties: Asset[];
  assetId?: number;
  onSubmitFormSuccess?: () => void;
  clear: number;
  onFormClear: () => void;
  containerStyles?: StyleProp<ViewStyle>;
  testID?: string;
  toggleLoading: (isLoading: boolean) => void;
  defaultCurrency: Currency;
}

const MAX_WORD_COUNT = 200;

export class AddRecordForm extends React.PureComponent<IOwnProps, IState> {
  public formRef: React.RefObject<any> = React.createRef();

  public constructor(props: IOwnProps) {
    super(props);
    const {
      assetId,
      defaultCurrency: { currencySymbol, currencyCode },
    } = props;
    this.state = {
      selectedFormType: FormType.Income,
      attachment: undefined,
      currencyCode,
      currencySymbol,
      ledgerCategories: [],
      formValues: {
        property: assetId ?? -1,
        label: '',
        tellerName: '',
        amount: '',
        category: '',
        date: DateUtils.getCurrentDate(),
        notes: '',
      },
    };
  }

  public async componentDidMount(): Promise<void> {
    const { toggleLoading, assetId } = this.props;

    if (assetId) {
      this.onChangeProperty(`${assetId}`);
    }
    toggleLoading(true);
    const categories = await LedgerRepository.getLedgerCategories();

    this.setState({ ledgerCategories: categories });
    toggleLoading(false);
  }

  public componentDidUpdate = (prevProps: IOwnProps): void => {
    const { clear: newVal } = this.props;
    const { clear: oldVal } = prevProps;

    if (newVal !== oldVal) {
      this.formRef.current.resetForm();
    }
  };

  public render(): ReactElement {
    const { containerStyles, t, assetId } = this.props;
    const { selectedFormType, formValues, currencyCode, currencySymbol } = this.state;

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
          innerRef={this.formRef}
          onSubmit={this.handleSubmit}
          initialValues={{ ...formValues }}
          validate={FormUtils.validate(this.formSchema)}
          enableReinitialize
        >
          {(formProps: FormikProps<FormikValues>): React.ReactNode => {
            const handleNotes = (value: string): void => {
              formProps.setFieldValue('notes', value);
            };

            return (
              <>
                <FormDropdown
                  formProps={formProps}
                  name="property"
                  options={this.loadPropertyNames()}
                  placeholder={t('selectProperty')}
                  maxLabelLength={36}
                  onChange={this.onChangeProperty}
                  isMandatory
                  label={t('property')}
                  listHeight={theme.viewport.height * 0.8}
                  isDisabled={!!assetId}
                />
                <FormTextInput
                  formProps={formProps}
                  inputType="default"
                  name="label"
                  label={t('details')}
                  placeholder={t('detailsPlaceholder')}
                  isMandatory
                />
                <FormTextInput
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
                  inputPrefixText={currencySymbol}
                  inputGroupSuffixText={currencyCode}
                  isMandatory
                />
                <FormDropdown
                  formProps={formProps}
                  name="category"
                  label={t('category')}
                  options={this.loadCategories()}
                  placeholder={t('categoryPlaceholder')}
                  maxLabelLength={36}
                  isMandatory
                />
                <FormCalendar
                  allowPastDates
                  maxDate={DateUtils.getCurrentDate()}
                  formProps={formProps}
                  name="date"
                  textType="label"
                  label={t('addDate')}
                  calendarTitle={t('addDate')}
                  placeHolder={t('addDatePlaceholder')}
                  isMandatory
                />
                <TextArea
                  value={formProps.values.notes}
                  placeholder={t('notesPlaceholder')}
                  label={t('notes')}
                  wordCountLimit={MAX_WORD_COUNT}
                  containerStyle={styles.inputStyle}
                  onMessageChange={handleNotes}
                />
                <UploadBoxComponent
                  icon={icons.document}
                  header={t('common:uploadDocument')}
                  subHeader={t('common:uploadDocHelperText')}
                  onCapture={this.handleUpload}
                  onDelete={this.handleDocumentDelete}
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

  private onChangeProperty = (value: string, formikProps?: FormikProps<FormikValues>): void => {
    const { properties } = this.props;
    properties.forEach((item) => {
      if (item.id === Number(value)) {
        const { currencies } = item.country;
        this.setState({
          currencyCode: currencies[0].currencyCode,
          currencySymbol: currencies[0].currencySymbol,
        });
      }
    });
    if (formikProps) {
      const { setFieldValue } = formikProps;
      setFieldValue('property', value);
    }
  };

  private loadPropertyNames = (): IDropdownOption[] => {
    const { properties } = this.props;

    return properties.map((property: Asset) => {
      return { value: property.id, label: property.projectName };
    });
  };

  private loadCategories = (): IDropdownOption[] => {
    const { selectedFormType, ledgerCategories } = this.state;
    const entryType = selectedFormType === FormType.Income ? LedgerTypes.credit : LedgerTypes.debit;

    return LedgerUtils.filterByType<LedgerCategory, LedgerTypes>(entryType, ledgerCategories).map(
      (category: LedgerCategory) => {
        return { value: category.id, label: category.name };
      }
    );
  };

  private formSchema = (): yup.ObjectSchema<IFormData> => {
    const { t } = this.props;

    return yup.object().shape({
      property: yup.number().moreThan(-1, t('propertyError')),
      label: yup.string().required(t('detailsError')),
      tellerName: yup.string().optional(),
      amount: yup.string().required(t('amountError')),
      category: yup.string().required(t('categoryError')),
      date: yup.string().required(t('dateError')),
      notes: yup.string().optional(),
    });
  };

  private handleUpload = (attachment: IDocumentSource): void => {
    this.setState({ attachment });
  };

  private handleDocumentDelete = (): void => {
    this.setState({
      attachment: {
        uri: '',
        type: '',
        name: '',
      },
    });
  };

  private handleSubmit = async (values: IFormData, formActions: FormikHelpers<IFormData>): Promise<void> => {
    const { property, label, tellerName, amount, category, notes, date } = values;
    const { selectedFormType, attachment, currencyCode } = this.state;
    const { toggleLoading } = this.props;
    let attachmentId = 0;

    toggleLoading(true);

    try {
      if (attachment) {
        /* Make an API call for uploading the document and extract the doc Id */
        const formData = new FormData();
        // @ts-ignore
        formData.append('files[]', attachment);
        const response = await AttachmentService.uploadImage(formData, AttachmentType.ASSET_RECORD);
        const { data } = response;
        attachmentId = data[0].id;
      }

      formActions.setSubmitting(true);

      const tellerInfo =
        selectedFormType === FormType.Income ? { payer_name: tellerName } : { receiver_name: tellerName };

      const payload = {
        asset: Number(property),
        entry_type: selectedFormType === FormType.Income ? LedgerTypes.credit : LedgerTypes.debit,
        label,
        ...(tellerName && tellerInfo),
        amount: Number(amount),
        category: Number(category),
        transaction_date: date,
        ...(notes && { notes }),
        attachment: attachmentId || null,
        currency: currencyCode,
      };

      await LedgerRepository.postGeneralLedgers(payload);
      toggleLoading(false);
      formActions.setSubmitting(false);

      const { onSubmitFormSuccess } = this.props;
      if (onSubmitFormSuccess) {
        onSubmitFormSuccess();
      }
    } catch (e) {
      toggleLoading(false);

      formActions.setSubmitting(false);
      formActions.resetForm({});
      AlertHelper.error({ message: e.message });
    }
  };
}

const namespace = LocaleConstants.namespacesKey;
export default withTranslation([namespace.assetFinancial, namespace.common])(AddRecordForm);

const styles = StyleSheet.create({
  inputStyle: {
    marginTop: 20,
  },
  uploadBox: {
    marginVertical: 20,
  },
});
