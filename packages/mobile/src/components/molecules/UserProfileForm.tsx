import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikProps } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import {
  IUpdateProfile,
  IUpdateProfileResponse,
  UpdateProfileTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { FormButton, FormTextInput, Text } from '@homzhub/common/src/components';
import { BottomSheet } from '@homzhub/mobile/src/components';
import PasswordVerificationForm from '@homzhub/mobile/src/components/molecules/PasswordVerificationForm';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps extends WithTranslation {
  onFormSubmitSuccess: (profileDetails: IUserProfileForm, profileUpdateResponse?: IUpdateProfileResponse) => void;
  formData?: IUserProfileForm;
  userFullName?: string;
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
    const { t, userFullName } = this.props;
    const { userProfileForm, isPasswordVerificationRequired } = this.state;

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
                    <View style={styles.initialsContainer}>
                      <Text type="large" textType="regular" style={styles.initials}>
                        {StringUtils.getInitials(userFullName || '')}
                      </Text>
                    </View>
                    <View style={[styles.cameraContainer, styles.roundBorder]}>
                      <Icon
                        size={16}
                        name={icons.camera}
                        color={theme.colors.white}
                        style={styles.cameraIcon}
                        onPress={FunctionUtils.noop}
                      />
                    </View>
                  </View>
                  <FormTextInput
                    name="firstName"
                    label={t('property:firstName')}
                    inputType="default"
                    placeholder={t('auth:enterFirstName')}
                    formProps={formProps}
                  />
                  <FormTextInput
                    name="lastName"
                    label={t('property:lastName')}
                    inputType="default"
                    placeholder={t('auth:enterLastName')}
                    formProps={formProps}
                  />
                  <FormTextInput
                    name="phone"
                    label={t('common:phone')}
                    maxLength={10}
                    inputPrefixText={formProps.values.phoneCode}
                    inputType="phone"
                    placeholder={t('auth:yourNumber')}
                    helpText={t('auth:otpVerification')}
                    phoneFieldDropdownText={t('auth:countryRegion')}
                    formProps={formProps}
                  />
                  <FormTextInput
                    name="email"
                    label={t('common:email')}
                    numberOfLines={1}
                    inputType="email"
                    placeholder={t('auth:enterEmail')}
                    formProps={formProps}
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
    const { userProfileForm } = this.state;
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
      onFormSubmitSuccess(userProfileForm, response && response.user_id ? undefined : response);
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
  roundBorder: {
    borderWidth: 1,
    borderColor: theme.colors.white,
    borderRadius: 50,
  },
  profileImage: {
    marginTop: 16,
    alignItems: 'center',
  },
  cameraContainer: {
    width: 24,
    height: 24,
    backgroundColor: theme.colors.primaryColor,
    bottom: 21,
    left: 24,
  },
  cameraIcon: {
    alignSelf: 'center',
    position: 'relative',
    top: 2,
  },
  initialsContainer: {
    ...(theme.circleCSS(80) as object),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.darkTint7,
    borderColor: theme.colors.white,
    borderWidth: 1,
  },
  initials: {
    color: theme.colors.white,
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
