import React, { createRef, PureComponent, RefObject } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { ILoginFormData } from '@homzhub/common/src/domain/repositories/interfaces';

interface ILoginFormProps extends WithTranslation {
  isEmailLogin?: boolean;
  handleForgotPassword?: () => void;
  onLoginSuccess: (payload: ILoginFormData) => void;
  testID?: string;
}

interface IFormData {
  email: string;
  phone: string;
  password: string;
  isEmailFlow: boolean;
  phoneCode: string;
}

class LoginForm extends PureComponent<ILoginFormProps, IFormData> {
  public password: RefObject<any> = createRef();

  public constructor(props: ILoginFormProps) {
    super(props);
    this.state = {
      email: '',
      phone: '',
      password: '',
      isEmailFlow: props.isEmailLogin || false,
      phoneCode: '',
    };
  }

  public render(): React.ReactNode {
    const { t, handleForgotPassword, isEmailLogin, testID } = this.props;
    const formData = { ...this.state };

    return (
      <KeyboardAvoidingView style={styles.flexOne} behavior={PlatformUtils.isIOS() ? 'padding' : undefined}>
        <Formik
          initialValues={formData}
          validate={FormUtils.validate(isEmailLogin ? this.loginEmailFormSchema : this.loginPhoneFormSchema)}
          onSubmit={this.handleSubmit}
        >
          {(formProps: FormikProps<IFormData>): React.ReactElement => (
            <>
              {this.renderLoginFields(formProps)}
              <FormButton
                // @ts-ignore
                onPress={formProps.handleSubmit}
                formProps={formProps}
                type="primary"
                title={t('login')}
                containerStyle={styles.submitStyle}
              />
              {isEmailLogin && PlatformUtils.isMobile() && (
                <Button
                  type="secondary"
                  title={t('auth:forgotPassword')}
                  fontType="semiBold"
                  textSize="small"
                  onPress={handleForgotPassword}
                  containerStyle={styles.forgotButtonStyle}
                  testID={testID}
                />
              )}
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    );
  }

  public handleSubmit = async (values: IFormData, formActions: FormikHelpers<IFormData>): Promise<void> => {
    const { onLoginSuccess, isEmailLogin, t } = this.props;
    formActions.setSubmitting(true);

    if (!isEmailLogin) {
      try {
        const phone = `${values.phoneCode}~${values.phone}`;
        const isPhoneUsed = await UserRepository.phoneExists(phone);
        if (!isPhoneUsed.is_exists) {
          AlertHelper.error({ message: t('auth:phoneNotExists') });
          return;
        }
      } catch (err) {
        AlertHelper.error({ message: t('common:genericErrorMessage') });
        return;
      }
    }

    const loginFormData: ILoginFormData = {
      email: values.email,
      password: values.password,
      phone_code: values.phoneCode,
      phone_number: values.phone,
    };

    onLoginSuccess(loginFormData);
    formActions.setSubmitting(false);
  };

  private renderLoginFields = (formProps: FormikProps<IFormData>): React.ReactElement => {
    const { t, handleForgotPassword, isEmailLogin } = this.props;

    const onPasswordFocus = (): void => this.password.current?.focus();

    const forgotPasswordButtonWeb = (): React.ReactElement => (
      <Button
        type="secondary"
        title={t('auth:forgotPassword')}
        fontType="semiBold"
        textSize="small"
        onPress={handleForgotPassword}
        containerStyle={styles.forgotButtonStyleWeb}
        titleStyle={styles.forgotButtonTextStyle}
      />
    );

    return (
      <>
        {isEmailLogin ? (
          <>
            <FormTextInput
              name="email"
              label="Email"
              inputType="email"
              placeholder={t('auth:enterEmail')}
              isMandatory
              formProps={formProps}
              onSubmitEditing={onPasswordFocus}
            />
            <FormTextInput
              ref={this.password}
              name="password"
              label="Password"
              inputType="password"
              placeholder={t('auth:newPassword')}
              isMandatory
              formProps={formProps}
              secondaryLabel={forgotPasswordButtonWeb}
            />
          </>
        ) : (
          <FormTextInput
            name="phone"
            label="Phone"
            inputType="phone"
            inputPrefixText={formProps.values.phoneCode}
            placeholder={t('auth:yourNumber')}
            helpText={t('auth:otpVerification')}
            phoneFieldDropdownText={t('auth:countryRegion')}
            isMandatory
            formProps={formProps}
          />
        )}
      </>
    );
  };

  private loginPhoneFormSchema = (): yup.ObjectSchema<{
    phone: string;
  }> => {
    const { t } = this.props;
    return yup.object().shape({
      phone: yup.string().required(t('moreProfile:fieldRequiredError')),
    });
  };

  private loginEmailFormSchema = (): yup.ObjectSchema<{
    email: string;
    password: string;
  }> => {
    const { t } = this.props;
    return yup.object().shape({
      email: yup.string().email(t('auth:emailValidation')).required(t('auth:emailRequired')),
      password: yup
        .string()
        .matches(FormUtils.passwordRegex, t('auth:passwordValidation'))
        .min(8, t('auth:minimumCharacters'))
        .required(t('auth:passwordRequired')),
    });
  };
}

const HOC = withTranslation()(LoginForm);
export { HOC as LoginForm };

const styles = StyleSheet.create({
  submitStyle: {
    flex: 0,
    marginTop: 30,
  },
  forgotButtonStyle: {
    borderWidth: 0,
    flex: 0,
    marginTop: 16,
  },
  webLoginPasswordField: {
    position: 'relative',
  },
  forgotButtonStyleWeb: {
    borderWidth: 0,
    width: 'fit-content',
  },
  forgotButtonTextStyle: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  flexOne: {
    flex: 1,
  },
});
