import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import ImagePicker, { Image as ImagePickerResponse } from 'react-native-image-crop-picker';
import { Formik, FormikProps } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { ObjectUtils } from '@homzhub/common/src/utils/ObjectUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { AttachmentService, AttachmentType } from '@homzhub/common/src/services/AttachmentService';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import {
  IUpdateProfile,
  IUpdateProfileResponse,
  UpdateProfileTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { Avatar } from '@homzhub/common/src/components/molecules/Avatar';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { BottomSheet } from '@homzhub/mobile/src/components';
import PasswordVerificationForm from '@homzhub/mobile/src/components/molecules/PasswordVerificationForm';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps extends WithTranslation {
  onFormSubmitSuccess: (profileDetails: IUserProfileForm, profileUpdateResponse?: IUpdateProfileResponse) => void;
  formData?: IUserProfileForm;
  userFullName?: string;
  profileImage?: string;
  isPasswordVerificationRequired?: boolean;
}

export interface IUserProfileForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  phoneCode: string;
}

interface IState {
  userProfileForm: IUserProfileForm;
  isPasswordVerificationRequired?: boolean;
  selectedImage: ImagePickerResponse;
}

export class UserProfileForm extends React.PureComponent<IProps, IState> {
  public state = {
    userProfileForm: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      phoneCode: '',
    },
    isPasswordVerificationRequired: false,
    selectedImage: {} as ImagePickerResponse,
  };

  public componentDidMount(): void {
    const { formData } = this.props;

    this.setState({
      userProfileForm: {
        firstName: (formData && formData.firstName) || '',
        lastName: (formData && formData.lastName) || '',
        phoneCode: (formData && formData.phoneCode) || '',
        phone: (formData && formData.phone) || '',
        email: (formData && formData.email) || '',
      },
    });
  }

  public render(): ReactElement {
    const { t, userFullName, profileImage } = this.props;
    const { userProfileForm, isPasswordVerificationRequired, selectedImage } = this.state;

    return (
      <>
        <Formik
          onSubmit={this.handleUpdate}
          initialValues={userProfileForm}
          validate={FormUtils.validate(this.formSchema)}
          enableReinitialize
        >
          {(formProps: FormikProps<IUserProfileForm>): React.ReactNode => {
            return (
              <>
                <View style={styles.container}>
                  <View style={styles.profileImage}>
                    <Avatar
                      isOnlyAvatar
                      imageSize={80}
                      fullName={userFullName || ''}
                      image={selectedImage.path ?? profileImage}
                      onPressCamera={this.handleProfileImageUpload}
                      initialsContainerStyle={styles.initialsContainer}
                    />
                  </View>
                  <FormTextInput
                    name="firstName"
                    label={t('property:firstName')}
                    inputType="default"
                    placeholder={t('auth:enterFirstName')}
                    formProps={formProps}
                    isMandatory
                  />
                  <FormTextInput
                    name="lastName"
                    label={t('property:lastName')}
                    inputType="default"
                    placeholder={t('auth:enterLastName')}
                    formProps={formProps}
                    isMandatory
                  />
                  <FormTextInput
                    name="phone"
                    label={t('common:phone')}
                    inputPrefixText={formProps.values.phoneCode}
                    inputType="phone"
                    placeholder={t('auth:yourNumber')}
                    helpText={t('auth:otpVerification')}
                    phoneFieldDropdownText={t('auth:countryRegion')}
                    formProps={formProps}
                    isMandatory
                  />
                  <FormTextInput
                    name="email"
                    label={t('common:email')}
                    numberOfLines={1}
                    inputType="email"
                    placeholder={t('auth:enterEmail')}
                    formProps={formProps}
                    isMandatory
                  />
                </View>
                <FormButton
                  formProps={formProps}
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  type="primary"
                  title={t('moreProfile:updateProfile')}
                  containerStyle={styles.buttonStyle}
                />
                <BottomSheet
                  sheetHeight={theme.viewport.height / 1.65}
                  visible={isPasswordVerificationRequired}
                  onCloseSheet={this.closeBottomSheet}
                >
                  <View>
                    <Text style={[styles.commonTextStyle, styles.passwordText]} type="large" textType="semiBold">
                      {t('passwordVerificationText')}
                    </Text>
                    <Text style={[styles.commonTextStyle, styles.helpText]} type="small">
                      {t('enterYourPasswordText')}
                    </Text>
                    <PasswordVerificationForm onFormSubmit={this.onSubmit} />
                  </View>
                </BottomSheet>
              </>
            );
          }}
        </Formik>
      </>
    );
  }

  private onSubmit = async (password?: string): Promise<void> => {
    const { onFormSubmitSuccess } = this.props;
    const { userProfileForm, selectedImage } = this.state;
    const { firstName, lastName, email, phone, phoneCode } = userProfileForm;
    const profileDetails = {
      first_name: firstName,
      last_name: lastName,
      phone_code: phoneCode,
      phone_number: phone,
      email,
    };

    if (password) {
      this.closeBottomSheet();
    }

    const payload: IUpdateProfile = {
      action: UpdateProfileTypes.GET_OTP_OR_UPDATE,
      payload: {
        ...(password && { password }),
        profile_details: profileDetails,
      },
    };

    try {
      const response = await UserRepository.updateUserProfileByActions(payload);
      if (!ObjectUtils.isEmpty(selectedImage)) {
        await this.uploadProfileImage();
      }
      onFormSubmitSuccess(userProfileForm, response && response.user_id ? undefined : response);
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private uploadProfileImage = async (): Promise<void> => {
    const { selectedImage } = this.state;
    try {
      const formData = new FormData();
      formData.append('files[]', {
        // @ts-ignore
        name: PlatformUtils.isIOS()
          ? selectedImage.filename
          : selectedImage.path.substring(selectedImage.path.lastIndexOf('/') + 1),
        uri: selectedImage.path,
        type: selectedImage.mime,
      });
      const imageData = await AttachmentService.uploadImage(formData, AttachmentType.PROFILE_IMAGE);
      const { data } = imageData;
      await UserRepository.updateProfileImage({ profile_picture: data[0].id });
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  private handleProfileImageUpload = async (): Promise<void> => {
    try {
      // @ts-ignore
      const image: ImagePickerResponse = await ImagePicker.openPicker({
        multiple: false,
        compressImageMaxWidth: 400,
        compressImageMaxHeight: 400,
        compressImageQuality: PlatformUtils.isAndroid() ? 1 : 0.8,
        includeBase64: true,
        mediaType: 'photo',
        freeStyleCropEnabled: true,
      });
      this.setState({ selectedImage: image });
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  private handleUpdate = async (
    values: IUserProfileForm,
    formikHelpers: FormikHelpers<IUserProfileForm>
  ): Promise<void> => {
    const { isPasswordVerificationRequired, formData } = this.props;
    const { phone, phoneCode, email } = values;

    formikHelpers.setSubmitting(true);
    if ((formData?.phone !== phone || formData?.phoneCode !== phoneCode) && formData?.email !== email) {
      formikHelpers.setFieldError('email', 'Both the fields cannot be edited');
      AlertHelper.error({ message: 'Both the fields cannot be edited' });
      return;
    }

    this.setState({ userProfileForm: { ...values } });
    if (
      (formData?.phone !== phone || formData?.phoneCode !== phoneCode || formData?.email !== email) &&
      isPasswordVerificationRequired
    ) {
      this.setState({ isPasswordVerificationRequired });
      return;
    }

    await this.onSubmit();
  };

  private closeBottomSheet = (): void => {
    this.setState({ isPasswordVerificationRequired: false });
  };

  private formSchema = (): yup.ObjectSchema<IUserProfileForm> => {
    const { t } = this.props;

    return yup.object().shape({
      firstName: yup.string().required(t('fieldRequiredError')),
      lastName: yup.string().required(t('fieldRequiredError')),
      email: yup.string().required(t('fieldRequiredError')),
      phoneCode: yup.string(),
      phone: yup.string().required(t('fieldRequiredError')),
    });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.moreProfile)(UserProfileForm);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    paddingHorizontal: theme.layout.screenPadding,
    backgroundColor: theme.colors.white,
  },
  buttonStyle: {
    flex: 0,
    margin: 16,
  },
  profileImage: {
    marginTop: 16,
    alignItems: 'center',
  },
  initialsContainer: {
    ...(theme.circleCSS(80) as object),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.darkTint7,
    borderColor: theme.colors.white,
    borderWidth: 1,
  },
  commonTextStyle: {
    textAlign: 'center',
  },
  passwordText: {
    marginTop: 20,
  },
  helpText: {
    marginBottom: 32,
  },
});
