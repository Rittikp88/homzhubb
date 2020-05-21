import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikActions, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';

interface ISignUpFormProps extends WithTranslation {
  isEmailLogin?: boolean;
}

interface ISignUpFormState {
  user: {
    email: string;
    phone: string;
    password: string;
  };
}

class LoginForm extends Component<ISignUpFormProps, ISignUpFormState> {
  public state = {
    user: {
      email: '',
      phone: '',
      password: '',
    },
  };

  public render(): React.ReactNode {
    const { t, isEmailLogin } = this.props;
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
              {isEmailLogin && (
                <Button
                  type="secondary"
                  title={t('auth:forgotPassword')}
                  fontType="semiBold"
                  textSize="small"
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
    const { t, isEmailLogin = false } = this.props;
    return (
      <>
        {isEmailLogin ? (
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
            maxLength={15}
            inputPrefixText="+91"
            placeholder={t('auth:yourNumber')}
            helpText={t('auth:otpVerification')}
            formProps={formProps}
          />
        )}
      </>
    );
  };

  private formSchema = (): yup.ObjectSchema<{ email: string; phone: string; password: string }> => {
    const { t } = this.props;
    return yup.object().shape({
      isEmailLogin: yup.boolean(),
      email: yup.string().when('isEmailLogin', {
        is: true,
        then: yup.string().email(t('auth:emailValidation')).required(t('auth:emailRequired')),
      }),
      phone: yup.string().required(t('auth:numberRequired')),
      password: yup.string().when('isEmailLogin', {
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
    formActions.setSubmitting(true);
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
