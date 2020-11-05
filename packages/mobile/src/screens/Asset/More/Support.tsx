import React, { Component, ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import { isEmpty } from 'lodash';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { MoreStackNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { AttachmentService, AttachmentType } from '@homzhub/common/src/services/AttachmentService';
import { icons } from '@homzhub/common/src/assets/icon';
import Check from '@homzhub/common/src/assets/images/check.svg';
import {
  Avatar,
  Button,
  Divider,
  FormButton,
  FormDropdown,
  FormTextInput,
  IDropdownOption,
  Text,
  TextArea,
} from '@homzhub/common/src/components';
import { AnimatedProfileHeader, BottomSheet, HeaderCard, UploadBoxComponent } from '@homzhub/mobile/src/components';
import { IDocumentSource } from '@homzhub/mobile/src/components/molecules/UploadBoxComponent';
import { User } from '@homzhub/common/src/domain/models/User';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IFormData {
  subject: string;
  category: number;
  description: string;
}

interface IScreenState {
  formData: IFormData;
  categories: IDropdownOption[];
  contact: User;
  attachment?: IDocumentSource;
  isFormSubmitted: boolean;
  isClearAttachment: boolean;
}

type Props = WithTranslation & NavigationScreenProps<MoreStackNavigatorParamList, ScreensKeys.SupportScreen>;

export class Support extends Component<Props, IScreenState> {
  private resetForm: ((nextValues?: FormikValues) => void) | undefined;

  public state = {
    formData: {
      subject: '',
      category: 0,
      description: '',
    },
    categories: [],
    contact: {} as User,
    attachment: undefined,
    isFormSubmitted: false,
    isClearAttachment: false,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.getCategories();
    await this.getContact();
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    const { isFormSubmitted } = this.state;
    return (
      <>
        <AnimatedProfileHeader title={t('assetMore:more')}>
          <HeaderCard
            title={t('assetMore:support')}
            titleFontWeight="semiBold"
            subTitle={t('clear')}
            renderItem={(): React.ReactElement | null => this.renderContent()}
            onIconPress={this.onGoBack}
            onClearPress={this.clearForm}
          />
        </AnimatedProfileHeader>
        <BottomSheet visible={isFormSubmitted} sheetHeight={400} onCloseSheet={this.onCloseSheet}>
          {this.renderContinueView()}
        </BottomSheet>
      </>
    );
  }

  private renderContent = (): React.ReactElement | null => {
    const { t } = this.props;
    const { contact } = this.state;
    if (isEmpty(contact)) {
      return null;
    }
    return (
      <View style={styles.content}>
        {/* TODO: Add selection picker once other flow is ready */}
        <View style={styles.contactView}>
          <Text type="small" textType="semiBold" style={styles.title}>
            {t('youContacting')}
          </Text>
          <Avatar
            fullName={contact.fullName}
            designation={t('homzhubTeam')}
            phoneCode={contact.countryCode}
            phoneNumber={contact.phoneNumber}
          />
        </View>
        <Divider />
        {this.renderForm()}
      </View>
    );
  };

  private renderForm = (): React.ReactElement => {
    const { t } = this.props;
    const { formData, categories, isClearAttachment } = this.state;
    return (
      <Formik
        onSubmit={this.handleFormSubmit}
        initialValues={{ ...formData }}
        validate={FormUtils.validate(this.formSchema)}
        enableReinitialize
      >
        {(formProps: FormikProps<FormikValues>): React.ReactNode => {
          const handleDescription = (value: string): void => {
            formProps.setFieldValue('description', value);
          };
          this.initializeReset(formProps);

          return (
            <>
              <FormTextInput
                formProps={formProps}
                isMandatory
                inputType="default"
                name="subject"
                label={t('subject')}
                placeholder={t('subjectPlaceholder')}
              />
              <FormDropdown
                name="category"
                placeholder={t('categoryExample')}
                label={t('assetFinancial:category')}
                isMandatory
                maxLabelLength={36}
                options={categories}
                formProps={formProps}
                dropdownContainerStyle={styles.dropdownStyle}
              />
              <TextArea
                value={formProps.values.description}
                placeholder={t('typeDescription')}
                label={t('assetDescription:description')}
                containerStyle={styles.textArea}
                onMessageChange={handleDescription}
              />
              <UploadBoxComponent
                icon={icons.document}
                header={t('uploadDocument')}
                subHeader={t('uploadDocHelperText')}
                onCapture={this.handleUpload}
                isClear={isClearAttachment}
                onDelete={this.handleDocumentDelete}
                containerStyle={styles.content}
              />
              <FormButton
                // @ts-ignore
                onPress={formProps.handleSubmit}
                formProps={formProps}
                disabled={!formProps.values.subject || !formProps.values.category}
                type="primary"
                title={t('submit')}
              />
            </>
          );
        }}
      </Formik>
    );
  };

  private renderContinueView = (): ReactElement => {
    const { t } = this.props;
    return (
      <>
        <View style={styles.sheetContent}>
          <Text type="large" textType="semiBold" style={styles.sheetTitle}>
            {t('common:messageSent')}
          </Text>
          <Text type="small">{t('common:inTouch')}</Text>
          <Check style={styles.content} />
        </View>
        <Button
          type="primary"
          title={t('common:continue')}
          containerStyle={styles.buttonStyle}
          onPress={this.onCloseSheet}
        />
      </>
    );
  };

  private onCloseSheet = (): void => {
    this.setState({ isFormSubmitted: false });
    this.clearForm();
  };

  private onGoBack = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private initializeReset = (formProps: FormikProps<FormikValues>): void => {
    if (!this.resetForm) {
      this.resetForm = formProps.resetForm;
    }
  };

  private clearForm = (): void => {
    if (this.resetForm) {
      this.resetForm();
      this.setState({
        isClearAttachment: true,
        attachment: undefined,
      });
    }
  };

  private formSchema = (): yup.ObjectSchema<IFormData> => {
    const { t } = this.props;

    return yup.object().shape({
      subject: yup.string().required(t('moreProfile:fieldRequiredError')),
      category: yup.number().required(t('moreProfile:fieldRequiredError')),
      description: yup.string(),
    });
  };

  private getCategories = async (): Promise<void> => {
    try {
      const response = await CommonRepository.getSupportCategories();
      const formattedData = response.map((item) => {
        return {
          label: item.label,
          value: item.id,
        };
      });
      this.setState({ categories: formattedData });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private getContact = async (): Promise<void> => {
    try {
      const response: User = await CommonRepository.getSupportContacts();
      this.setState({ contact: response });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private handleUpload = (attachment: IDocumentSource): void => {
    this.setState({ attachment, isClearAttachment: false });
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

  private handleFormSubmit = async (values: IFormData, formActions: FormikHelpers<IFormData>): Promise<void> => {
    const { attachment } = this.state;
    const { subject, description, category } = values;
    let attachmentId = 0;

    try {
      // @ts-ignore
      if (attachment && !!attachment.uri) {
        /* Make an API call for uploading the document and extract the doc Id */
        const formData = new FormData();
        // @ts-ignore
        formData.append('files[]', attachment);
        const response = await AttachmentService.uploadImage(formData, AttachmentType.ASSET_DOCUMENT);
        const { data } = response;
        attachmentId = data[0].id;
      }
      formActions.setSubmitting(true);

      const payload = {
        support_category: Number(category),
        title: subject,
        description,
        attachments: attachmentId > 0 ? [attachmentId] : [],
      };
      await CommonRepository.postClientSupport(payload);
      this.setState({
        isFormSubmitted: true,
        isClearAttachment: true,
        attachment: undefined,
      });
      formActions.resetForm({});
    } catch (e) {
      formActions.setSubmitting(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };
}

export default withTranslation()(Support);

const styles = StyleSheet.create({
  sheetContent: {
    alignItems: 'center',
  },
  sheetTitle: {
    marginBottom: 8,
  },
  buttonStyle: {
    flex: 0,
    marginHorizontal: 16,
  },
  title: {
    marginBottom: 20,
  },
  content: {
    marginVertical: 24,
  },
  contactView: {
    marginBottom: 18,
  },
  dropdownStyle: {
    paddingVertical: 12,
  },
  textArea: {
    marginTop: 10,
  },
});
