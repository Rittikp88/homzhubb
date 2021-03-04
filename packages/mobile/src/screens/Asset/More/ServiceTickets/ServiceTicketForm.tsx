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
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AttachmentType } from '@homzhub/common/src/constants/AttachmentTypes';

interface IFormValues {
  propertyName: string;
  title: string;
  category: string;
  subCategory: string;
  issueDesctiption?: string;
}

interface IScreeState {
  serviceForm: IFormValues;
  attachments: IDocumentSource[];
  clearCount: number;
  isScreenLoading: boolean;
}

// TODO: add types
interface IStateToProps {
  properties: Asset[];
  categories: any;
  subCategories: any;
}

type NavigationProps = NavigationScreenProps<AppStackParamList, ScreensKeys.AddServiceTicket>;

type Props = WithTranslation & IStateToProps & NavigationProps;

class ServiceTicketForm extends React.PureComponent<Props, IScreeState> {
  public formRef: React.RefObject<any> = React.createRef();

  constructor(props: Props) {
    super(props);
    const { route } = this.props;

    this.state = {
      serviceForm: {
        propertyName: (route && route.params && route.params.propertyName) || '',
        title: '',
        category: '',
        subCategory: '',
        issueDesctiption: '',
      },
      attachments: [],
      clearCount: 0,
      isScreenLoading: false,
    };
    this.formRef = React.createRef<typeof Formik>();
  }

  public componentDidUpdate = (prevProps: Props, prevState: IScreeState): void => {
    const { clearCount: newVal } = this.state;
    const { clearCount: oldVal } = prevState;

    if (newVal !== oldVal) {
      this.formRef.current.resetForm();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ attachments: [] });
    }
  };

  // TODO: (Shivam: 4/3/21): add category and sub category api
  public render(): React.ReactElement {
    const {
      t,
      route,
      navigation: { goBack },
    } = this.props;
    const { serviceForm, attachments, isScreenLoading } = this.state;
    const propertyName = route && route.params && route.params.propertyName;

    return (
      <>
        <UserScreen
          title={t('ticket')}
          pageTitle={t('newTicket')}
          onBackPress={goBack}
          rightNode={this.renderClearButton()}
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

                return (
                  <>
                    <FormDropdown
                      textType="label"
                      textSize="large"
                      fontType="regular"
                      options={this.getProperties()}
                      name="propertyName"
                      formProps={formProps}
                      label={t('property')}
                      placeholder={t('selectProperty')}
                      isMandatory
                      isDisabled={!!propertyName}
                    />
                    <FormTextInput
                      label={t('title')}
                      formProps={formProps}
                      name="title"
                      placeholder={t('exampleTitle')}
                      inputType="default"
                      isMandatory
                    />
                    <FormDropdown
                      textType="label"
                      textSize="large"
                      fontType="regular"
                      label={t('category')}
                      options={this.getCategories()}
                      name="category"
                      formProps={formProps}
                      placeholder={t('selectCategory')}
                      isMandatory
                    />
                    <FormDropdown
                      textType="label"
                      textSize="large"
                      fontType="regular"
                      options={this.getSubCategories()}
                      name="subCategory"
                      label={t('subCategory')}
                      formProps={formProps}
                      placeholder={t('selectSubCategory')}
                      isMandatory
                    />
                    <TextArea
                      label={t('description')}
                      placeholder={t('typeIssue')}
                      value={values.issueDesctiption}
                      onMessageChange={onMessageChange}
                      wordCountLimit={200}
                      helpText={t('optional')}
                      containerStyle={styles.description}
                    />
                    <UploadBoxComponent
                      attachments={attachments}
                      icon={icons.document}
                      header={t('common:uploadDocument')}
                      subHeader={t('common:uploadDocHelperText')}
                      onCapture={this.handleUpload}
                      onDelete={this.handleDocumentDelete}
                      containerStyle={styles.uploadBox}
                    />
                    <FormButton
                      onPress={(): void => formProps.handleSubmit()}
                      formProps={formProps}
                      type="primary"
                      title={t('submit')}
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
          {t('clear')}
        </Label>
      </TouchableOpacity>
    );
  };

  private onClear = (): void => {
    this.setState((prevState: IScreeState) => {
      return { clearCount: prevState.clearCount + 1 };
    });
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

  // TODO: (shivam: 4/3/21) add api data
  private getCategories = (): IDropdownOption[] => {
    const { properties } = this.props;

    return properties.map((property: Asset) => {
      return { value: property.id, label: property.projectName };
    });
  };

  private getSubCategories = (): IDropdownOption[] => {
    const { properties } = this.props;

    return properties.map((property: Asset) => {
      return { value: property.id, label: property.projectName };
    });
  };

  private formSchema = (): yup.ObjectSchema<IFormValues> => {
    const { t } = this.props;

    return yup.object().shape({
      propertyName: yup.string().required(t('propertyError')),
      title: yup.string().required(t('titleError')),
      category: yup.string().required(t('categoryError')),
      subCategory: yup.string().required(t('subCategoryError')),
      issueDesctiption: yup.string().optional(),
    });
  };

  private handleSubmit = async (values: IFormValues, formActions: FormikHelpers<IFormValues>): Promise<void> => {
    const { propertyName, subCategory, title, issueDesctiption } = values;
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

      const payload = {
        ticket_category: Number(subCategory),
        asset: Number(propertyName),
        attachments: attachmentIds,
        title,
        description: issueDesctiption,
      };

      await TicketRepository.postTicket(payload);
      this.setState({ isScreenLoading: false });

      formActions.setSubmitting(false);
      // TODO: (Shivam: 4/3.21) navigate to ticket detail screen
    } catch (e) {
      this.setState({ isScreenLoading: false });
      formActions.setSubmitting(false);
      formActions.resetForm({});
      AlertHelper.error({ message: e.message });
    }
  };
}
const mapStateToProps = (state: IState): IStateToProps => {
  return {
    properties: UserSelector.getUserAssets(state),
    categories: [],
    subCategories: [],
  };
};

const { namespacesKey: namespace } = LocaleConstants;
export default connect(
  mapStateToProps,
  null
)(withTranslation([namespace.serviceTickets, namespace.common, namespace.assetFinancial])(ServiceTicketForm));

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
