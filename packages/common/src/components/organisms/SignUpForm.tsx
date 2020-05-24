/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikActions, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton } from '@homzhub/common/src/components/molecules/FormButton';
import { FormTextInput } from '@homzhub/common/src/components/molecules/FormTextInput';
import { TermsCondition } from '@homzhub/common/src/components/molecules/TermsAndCondition';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';

interface ISignUpFormProps extends WithTranslation {
  onSubmitFormSuccess: (payload: ISignUpPayload, ref: FormTextInput | null) => void;
}

interface ISignUpFormState {
  user: {
    name: string;
    email: string;
    phone: string;
    password: string;
  };
}

class SignUpForm extends Component<ISignUpFormProps, ISignUpFormState> {
  public name: FormTextInput | null = null;
  public email: FormTextInput | null = null;
  public phone: FormTextInput | null = null;
  public password: FormTextInput | null = null;

  public state = {
    user: {
      name: '',
      email: '',
      phone: '',
      password: '',
    },
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    const { user } = this.state;
    const formData = { ...user };

    return (
      <View style={styles.container}>
        <Formik initialValues={formData} validate={FormUtils.validate(this.formSchema)} onSubmit={this.handleSubmit}>
          {(formProps: FormikProps<FormikValues>): React.ReactNode => {
            const onEmailFocus = (): void => this.email?.focus();
            const onPasswordFocus = (): void => this.password?.focus();
            const onPhoneNumberFocus = (): void => this.phone?.focus();

            return (
              <>
                <FormTextInput
                  ref={(refs) => (this.name = refs)}
                  name="name"
                  label="Name"
                  inputType="default"
                  placeholder={t('auth:enterName')}
                  formProps={formProps}
                  onSubmitEditing={onEmailFocus}
                />
                <FormTextInput
                  ref={(refs) => (this.email = refs)}
                  name="email"
                  label="Email"
                  inputType="email"
                  placeholder={t('auth:enterEmail')}
                  formProps={formProps}
                  onSubmitEditing={onPhoneNumberFocus}
                />
                <FormTextInput
                  ref={(refs) => (this.phone = refs)}
                  name="phone"
                  label="Phone"
                  inputType="phone"
                  maxLength={10}
                  inputPrefixText="+91"
                  placeholder={t('auth:yourNumber')}
                  helpText={t('auth:otpVerification')}
                  formProps={formProps}
                  onSubmitEditing={onPasswordFocus}
                />
                <FormTextInput
                  ref={(refs) => (this.password = refs)}
                  name="password"
                  label="Password"
                  inputType="password"
                  placeholder={t('auth:newPassword')}
                  helpText={t('auth:passwordValidation')}
                  formProps={formProps}
                />
                <TermsCondition />
                <FormButton
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  formProps={formProps}
                  type="primary"
                  title={t('auth:signup')}
                  containerStyle={styles.submitStyle}
                />
              </>
            );
          }}
        </Formik>
      </View>
    );
  }

  private formSchema = (): yup.ObjectSchema<{ email: string; name: string; phone: string; password: string }> => {
    const { t } = this.props;
    return yup.object().shape({
      name: yup.string().matches(FormUtils.nameRegex, t('auth:onlyAlphabets')).required(t('auth:nameRequired')),
      email: yup.string().email(t('auth:emailValidation')).required(t('auth:emailRequired')),
      phone: yup.string().required(t('auth:numberRequired')),
      password: yup
        .string()
        .matches(FormUtils.passwordRegex, t('auth:passwordValidation'))
        .min(8, t('auth:minimumCharacters'))
        .required(t('auth:passwordRequired')),
    });
  };

  public handleSubmit = (values: FormikValues, formActions: FormikActions<FormikValues>): void => {
    const { onSubmitFormSuccess } = this.props;
    formActions.setSubmitting(true);
    const signUpData: ISignUpPayload = {
      full_name: values.name,
      email: values.email,
      country_code: 'IN',
      phone_number: values.phone,
      password: values.password,
    };
    const phoneRef = this.phone;
    onSubmitFormSuccess(signUpData, phoneRef);
  };
}

const HOC = withTranslation()(SignUpForm);
export { HOC as SignUpForm };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.layout.screenPadding,
  },
  submitStyle: {
    flex: 0,
    marginVertical: 4,
  },
});
