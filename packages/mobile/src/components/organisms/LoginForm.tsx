import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { ILoginFormData } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, FormButton, FormTextInput } from '@homzhub/common/src/components';

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

class LoginForm extends Component<ILoginFormProps, IFormData> {
  public email: FormTextInput | null = null;
  public phone: FormTextInput | null = null;
  public password: FormTextInput | null = null;

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
    const { t, handleForgotPassword, testID } = this.props;
    const { isEmailFlow } = this.state;
    const formData = { ...this.state };

    return (
      <View style={styles.container}>
        <Formik initialValues={formData} validate={FormUtils.validate(this.formSchema)} onSubmit={this.handleSubmit}>
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
              {isEmailFlow && (
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
      </View>
    );
  }

  private renderLoginFields = (formProps: FormikProps<IFormData>): React.ReactElement => {
    const { t } = this.props;
    const { isEmailFlow } = this.state;
    const onPasswordFocus = (): void => this.password?.focus();
    return (
      <>
        {isEmailFlow ? (
          <>
            <FormTextInput
              ref={(refs): void => {
                this.email = refs;
              }}
              name="email"
              label="Email"
              inputType="email"
              placeholder={t('auth:enterEmail')}
              formProps={formProps}
              onSubmitEditing={onPasswordFocus}
            />
            <FormTextInput
              ref={(refs): void => {
                this.password = refs;
              }}
              name="password"
              label="Password"
              inputType="password"
              placeholder={t('auth:newPassword')}
              formProps={formProps}
            />
          </>
        ) : (
          <FormTextInput
            ref={(refs): void => {
              this.phone = refs;
            }}
            name="phone"
            label="Phone"
            inputType="phone"
            maxLength={10}
            inputPrefixText={formProps.values.phoneCode}
            placeholder={t('auth:yourNumber')}
            helpText={t('auth:otpVerification')}
            phoneFieldDropdownText={t('auth:countryRegion')}
            formProps={formProps}
          />
        )}
      </>
    );
  };

  public handleSubmit = (values: IFormData, formActions: FormikHelpers<IFormData>): void => {
    const { onLoginSuccess } = this.props;
    formActions.setSubmitting(true);

    const loginFormData: ILoginFormData = {
      email: values.email,
      password: values.password,
      phone_code: values.phoneCode,
      phone_number: values.phone,
    };

    onLoginSuccess(loginFormData);
    formActions.setSubmitting(false);
  };

  private formSchema = (): yup.ObjectSchema<{
    isEmailFlow: boolean;
    email: string;
    phone: string;
    password: string;
  }> => {
    const { t } = this.props;
    return yup.object().shape({
      isEmailFlow: yup.boolean(),
      email: yup.string().when('isEmailFlow', {
        is: true,
        then: yup.string().email(t('auth:emailValidation')).required(t('auth:emailRequired')),
      }),
      phone: yup.string().when('isEmailFlow', {
        is: false,
        then: yup.string().required(t('auth:numberRequired')),
      }),
      password: yup.string().when('isEmailFlow', {
        is: true,
        then: yup
          .string()
          .matches(FormUtils.passwordRegex, t('auth:passwordValidation'))
          .min(8, t('auth:minimumCharacters'))
          .required(t('auth:passwordRequired')),
      }),
    });
  };
}

const HOC = withTranslation()(LoginForm);
export { HOC as LoginForm };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: theme.layout.screenPadding,
  },
  submitStyle: {
    flex: 0,
    marginTop: 30,
  },
  forgotButtonStyle: {
    borderWidth: 0,
    flex: 0,
    marginTop: 16,
  },
});
