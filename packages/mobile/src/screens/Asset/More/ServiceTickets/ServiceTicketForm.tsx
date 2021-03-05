import React from 'react';
import * as yup from 'yup';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import { connect } from 'react-redux';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { TicketRepository } from '@homzhub/common/src/domain/repositories/TicketRepository';
import { AttachmentService } from '@homzhub/common/src/services/AttachmentService';
import { AppStackParamList } from '@homzhub/mobile/src/navigation/AppNavigator';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Loader } from '@homzhub/common/src/components/atoms/Loader';
import { TextArea } from '@homzhub/common/src/components/atoms/TextArea';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormDropdown, IDropdownOption } from '@homzhub/common/src/components/molecules/FormDropdown';
import { IDocumentSource } from '@homzhub/mobile/src/components/molecules/UploadBoxComponent';
import { IUploadAttachmentResponse } from '@homzhub/mobile/src/components/organisms/AddRecordForm';
import { UploadBoxComponent } from '@homzhub/mobile/src/components';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { TicketCategory } from '@homzhub/common/src/domain/models/TicketCategory';
import { Unit } from '@homzhub/common/src/domain/models/Unit';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';

interface IFormValues {
  property: number;
  title: string;
  category: string;
  subCategory: string;
  issueDesctiption?: string;
  otherCategory?: string;
}

interface IScreeState {
  serviceForm: IFormValues;
  attachments: IDocumentSource[];
  clearCount: number;
  isScreenLoading: boolean;
  selectedCategoryId: number;
  categories: IDropdownOption[];
  subCategories: IDropdownOption[];
  categoryWithSubCategory: TicketCategory[];
}

interface IStateToProps {
  properties: Asset[];
}

type NavigationProps = NavigationScreenProps<AppStackParamList, ScreensKeys.AddServiceTicket>;

type Props = WithTranslation & IStateToProps & NavigationProps;

class ServiceTicketForm extends React.PureComponent<Props, IScreeState> {
  public formRef: React.RefObject<any> = React.createRef();

  constructor(props: Props) {
    super(props);
    const { route } = this.props;
    const propertId = (route && route.params && route.params.propertyId) || -1;

    this.state = {
      serviceForm: {
        property: propertId,
        title: '',
        category: '',
        subCategory: '',
        issueDesctiption: '',
        otherCategory: '',
      },
      attachments: [],
      clearCount: 0,
      isScreenLoading: false,
      categories: [],
      subCategories: [],
      categoryWithSubCategory: [],
      selectedCategoryId: -1,
    };
    this.formRef = React.createRef<typeof Formik>();
  }

  public async componentDidMount(): Promise<void> {
    const ticketCategories = await TicketRepository.getTicketCategories();
    const dropDowncategories = ticketCategories.map((category: TicketCategory) => {
      const { name, id } = category;
      return { value: id, label: name };
    });

    this.setState({ categories: dropDowncategories, categoryWithSubCategory: ticketCategories });

    const subCategories = this.getSubCategories();
    if (subCategories) {
      this.setState({ subCategories });
    }
  }

  public componentDidUpdate = (prevProps: Props, prevState: IScreeState): void => {
    const { clearCount: newVal, selectedCategoryId: newCatogoryId } = this.state;
    const { clearCount: oldVal, selectedCategoryId: oldCategoryId } = prevState;

    if (newVal !== oldVal) {
      this.formRef.current.resetForm({});
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ attachments: [], selectedCategoryId: -1 });
    }
    if (newCatogoryId !== oldCategoryId) {
      const subCategories = this.getSubCategories();
      if (subCategories) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ subCategories });
      }
    }
  };

  public render(): React.ReactElement {
    const {
      t,
      route,
      navigation: { goBack },
    } = this.props;
    const { serviceForm, attachments, isScreenLoading, categories, subCategories, selectedCategoryId } = this.state;
    const propertyId = route && route.params && route.params.propertyId;

    return (
      <>
        <UserScreen
          title={t('assetMore:tickets')}
          pageTitle={t('serviceTickets:newTicket')}
          onBackPress={goBack}
          rightNode={this.renderClearButton()}
          scrollEnabled
        >
          <View style={styles.container}>
            <Formik
              onSubmit={this.handleSubmit}
              initialValues={serviceForm}
              validate={FormUtils.validate(this.formSchema)}
              innerRef={this.formRef}
            >
              {(formProps: FormikProps<FormikValues>): React.ReactElement => {
                const { values, setFieldValue } = formProps;

                const onMessageChange = (description: string): void => {
                  setFieldValue('issueDesctiption', description);
                };
                const isSubmitDisabled =
                  !FormUtils.isValuesTouched(values, ['issueDesctiption', 'otherCategory']) || attachments.length <= 0;

                const subCategorySelectedValue = values.subCategory;
                let isOtherSelected = false;

                const selectedSubCategory = subCategories.find(
                  (subCategory: IDropdownOption) => subCategory.value === subCategorySelectedValue
                );

                if (selectedSubCategory) {
                  isOtherSelected = selectedSubCategory.label === 'Others';
                }

                return (
                  <>
                    <FormDropdown
                      textType="label"
                      textSize="large"
                      fontType="regular"
                      options={this.getProperties()}
                      name="property"
                      formProps={formProps}
                      label={t('assetFinancial:property')}
                      placeholder={t('assetFinancial:selectProperty')}
                      isMandatory
                      isDisabled={propertyId ? propertyId >= 0 : false}
                      onChange={(value: string): void => setFieldValue('property', value)}
                    />
                    <FormTextInput
                      label={t('serviceTickets:title')}
                      formProps={formProps}
                      name="title"
                      placeholder={t('serviceTickets:exampleTitle')}
                      inputType="default"
                      isMandatory
                    />
                    <FormDropdown
                      textType="label"
                      textSize="large"
                      fontType="regular"
                      label={t('assetFinancial:category')}
                      options={categories}
                      name="category"
                      formProps={formProps}
                      placeholder={t('serviceTickets:selectCategory')}
                      isMandatory
                      onChange={this.setSelectedCatogory}
                    />
                    {selectedCategoryId > 0 && (
                      <FormDropdown
                        textType="label"
                        textSize="large"
                        fontType="regular"
                        options={subCategories}
                        name="subCategory"
                        label={t('serviceTickets:subCategory')}
                        formProps={formProps}
                        placeholder={t('serviceTickets:selectSubCategory')}
                        isMandatory
                      />
                    )}
                    {isOtherSelected && (
                      <FormTextInput
                        label={t('serviceTickets:otherCategory')}
                        formProps={formProps}
                        name="otherCategory"
                        placeholder={t('serviceTickets:enterOtherCategory')}
                        inputType="default"
                      />
                    )}
                    <TextArea
                      label={t('serviceTickets:description')}
                      placeholder={t('serviceTickets:typeIssue')}
                      value={values.issueDesctiption}
                      onMessageChange={onMessageChange}
                      wordCountLimit={200}
                      helpText={t('common:optional')}
                      containerStyle={styles.description}
                    />
                    <UploadBoxComponent
                      attachments={attachments}
                      icon={icons.document}
                      header={t('serviceTickets:addIssuePhotos')}
                      subHeader={t('serviceTickets:uploadIssuePhotoHelperText')}
                      onCapture={this.handleUpload}
                      onDelete={this.handleDocumentDelete}
                      containerStyle={styles.uploadBox}
                    />
                    <FormButton
                      onPress={(): void => formProps.handleSubmit()}
                      formProps={formProps}
                      type="primary"
                      title={t('common:submit')}
                      disabled={isSubmitDisabled}
                    />
                  </>
                );
              }}
            </Formik>
          </View>
        </UserScreen>
        <Loader visible={isScreenLoading} />
      </>
    );
  }

  private renderClearButton = (): React.ReactElement => {
    const { t } = this.props;

    return (
      <TouchableOpacity onPress={this.onClear}>
        <Label type="large" textType="semiBold" style={styles.clear}>
          {t('common:clear')}
        </Label>
      </TouchableOpacity>
    );
  };

  private onClear = (): void => {
    this.setState((prevState: IScreeState) => {
      return { clearCount: prevState.clearCount + 1 };
    });
  };

  private setSelectedCatogory = (value: string, props?: FormikProps<FormikValues>): void => {
    if (props) {
      const { setFieldValue } = props;
      setFieldValue('subCategory', '');
    }
    this.setState({ selectedCategoryId: Number(value) });
  };

  private getSubCategories = (): IDropdownOption[] | null => {
    const { selectedCategoryId, categoryWithSubCategory } = this.state;

    let dropDownSubCategories = null;
    const selectedCategory = categoryWithSubCategory.find(
      (category: TicketCategory) => category.id === selectedCategoryId
    );

    if (selectedCategoryId && selectedCategory) {
      const { subCategories } = selectedCategory;

      dropDownSubCategories = subCategories.map((subCategory: Unit) => {
        const { name, id } = subCategory;
        return { value: id, label: name };
      });
    }

    return dropDownSubCategories;
  };

  private handleUpload = (attachments: IDocumentSource[]): void => {
    this.setState((prevState: IScreeState) => {
      return { attachments: [...prevState.attachments, ...attachments] };
    });
  };

  private handleDocumentDelete = (uri: string): void => {
    this.setState((prevState: IScreeState) => {
      return { attachments: prevState.attachments.filter((file) => file.uri !== uri) };
    });
  };

  private getProperties = (): IDropdownOption[] => {
    const { properties } = this.props;

    return properties.map((property: Asset) => {
      return { value: property.id, label: property.projectName };
    });
  };

  private formSchema = (): yup.ObjectSchema<IFormValues> => {
    const { t } = this.props;

    return yup.object().shape({
      property: yup.number().moreThan(-1, t('serviceTickets:propertyError')),
      title: yup.string().required(t('serviceTickets:titleError')),
      category: yup.string().required(t('serviceTickets:categoryError')),
      subCategory: yup.string().required(t('serviceTickets:subCategoryError')),
      issueDesctiption: yup.string().optional(),
      otherCategory: yup.string().optional(),
    });
  };

  private handleSubmit = async (values: IFormValues, formActions: FormikHelpers<IFormValues>): Promise<void> => {
    const { property, subCategory, title, issueDesctiption, otherCategory } = values;
    const { attachments } = this.state;

    let attachmentIds: Array<number> = [];

    this.setState({ isScreenLoading: true });

    try {
      if (attachments.length) {
        /* Make an API call for uploading the document and extract the doc Id */
        const formData = new FormData();
        attachments.forEach((attachment: IDocumentSource) => {
          // @ts-ignore
          formData.append('files[]', attachment);
        });
        const response = await AttachmentService.uploadImage(formData, AttachmentType.TICKET_DOCUMENTS);
        const { data } = response;
        attachmentIds = data.map((i: IUploadAttachmentResponse) => i.id);
      }

      formActions.setSubmitting(true);
      const otherField = otherCategory ? { others_field_description: otherCategory } : {};

      const payload = {
        ticket_category: Number(subCategory),
        asset: Number(property),
        attachments: attachmentIds,
        title,
        description: issueDesctiption,
        ...otherField,
      };

      await TicketRepository.postTicket(payload);
      formActions.resetForm({});
      this.setState({ isScreenLoading: false, selectedCategoryId: -1, attachments: [] });

      formActions.setSubmitting(false);
      // TODO: (Shivam: 4/3.21) navigate to ticket detail screen
    } catch (e) {
      this.setState({ isScreenLoading: false, selectedCategoryId: -1, attachments: [] });
      formActions.setSubmitting(false);
      formActions.resetForm({});
      AlertHelper.error({ message: e.message });
    }
  };
}
const mapStateToProps = (state: IState): IStateToProps => {
  return {
    properties: UserSelector.getUserAssets(state),
  };
};

export default connect(mapStateToProps, null)(withTranslation()(ServiceTicketForm));

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  clear: {
    color: theme.colors.blue,
  },
  description: {
    marginTop: 16,
  },
  uploadBox: {
    marginVertical: 20,
  },
});
