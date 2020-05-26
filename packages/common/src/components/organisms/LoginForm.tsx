import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikActions, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { ILoginFormData } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';

interface ILoginFormProps extends WithTranslation {
  isEmailLogin?: boolean;
  handleForgotPassword?: () => void;
  onLoginSuccess: (payload: ILoginFormData) => void;
}

interface ILoginFormState {
  user: {
    email: string;
    phone: string;
    password: string;
    isEmailFlow: boolean;
  };
}

class LoginForm extends Component<ILoginFormProps, ILoginFormState> {
  public constructor(props: ILoginFormProps) {
    super(props);
    this.state = {
      user: {
        email: '',
        phone: '',
        password: '',
        isEmailFlow: props.isEmailLogin || false,
      },
    };
  }

  public render(): React.ReactNode {
    const { t, handleForgotPassword } = this.props;
    const { user } = this.state;
    const formData = { ...user };

    return (
      <View style={styles.container}>
        <Formik initialValues={formData} validate={FormUtils.validate(this.formSchema)} onSubmit={this.handleSubmit}>
          {(formProps: FormikProps<FormikValues>): React.ReactElement => (
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
              {user.isEmailFlow && (
                <Button
                  type="secondary"
                  title={t('auth:forgotPassword')}
                  fontType="semiBold"
                  textSize="small"
                  onPress={handleForgotPassword}
                  containerStyle={styles.forgotButtonStyle}
                />
              )}
            </>
          )}
        </Formik>
      </View>
    );
  }

  private renderLoginFields = (formProps: FormikProps<FormikValues>): React.ReactElement => {
    const { t } = this.props;
    const {
      user: { isEmailFlow },
    } = this.state;
    return (
      <>
        {isEmailFlow ? (
          <>
            <FormTextInput
              name="email"
              label="Email"
              inputType="email"
              placeholder={t('auth:enterEmail')}
              formProps={formProps}
            />
            <FormTextInput
              name="password"
              label="Password"
              inputType="password"
              placeholder={t('auth:newPassword')}
              formProps={formProps}
            />
          </>
        ) : (
          <FormTextInput
            name="phone"
            label="Phone"
            inputType="phone"
            maxLength={10}
            inputPrefixText="+91"
            placeholder={t('auth:yourNumber')}
            helpText={t('auth:otpVerification')}
            formProps={formProps}
          />
        )}
      </>
    );
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

  public handleSubmit = (values: FormikValues, formActions: FormikActions<FormikValues>): void => {
    const { onLoginSuccess } = this.props;
    formActions.setSubmitting(true);
    const loginFormDta: ILoginFormData = {
      email: values.email,
      password: values.password,
      country_code: 'IN',
      phone_number: values.phone,
    };

    onLoginSuccess(loginFormDta);
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
