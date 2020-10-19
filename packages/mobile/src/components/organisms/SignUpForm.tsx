/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton, FormTextInput, TermsCondition } from '@homzhub/common/src/components';

interface ISignUpFormProps extends WithTranslation {
  testID?: string;
  onPressLink: () => void;
  onSubmitFormSuccess: (payload: ISignUpPayload, ref: () => FormTextInput | null) => void;
}

interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface ISignUpFormState {
  user: IFormData;
  countryCode: string;
}

class SignUpForm extends Component<ISignUpFormProps, ISignUpFormState> {
  public firstName: FormTextInput | null = null;
  public lastName: FormTextInput | null = null;
  public email: FormTextInput | null = null;
  public phone: FormTextInput | null = null;
  public password: FormTextInput | null = null;

  public state = {
    user: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
    },
    countryCode: '+91',
  };

  public render(): React.ReactNode {
    const { t, testID, onPressLink } = this.props;
    const { user, countryCode } = this.state;

    return (
      <View style={styles.container}>
        <Formik initialValues={{ ...user }} validate={FormUtils.validate(this.formSchema)} onSubmit={this.handleSubmit}>
          {(formProps: FormikProps<FormikValues>): React.ReactNode => {
            const onEmailFocus = (): void => this.email?.focus();
            const onPasswordFocus = (): void => this.password?.focus();
            const onPhoneNumberFocus = (): void => this.phone?.focus();

            return (
              <>
                <FormTextInput
                  ref={(refs): void => {
                    this.firstName = refs;
                  }}
                  name="firstName"
                  label="First Name"
                  inputType="name"
                  placeholder={t('auth:enterFirstName')}
                  formProps={formProps}
                  onSubmitEditing={onEmailFocus}
                />
                <FormTextInput
                  ref={(refs): void => {
                    this.lastName = refs;
                  }}
                  name="lastName"
                  label="Last Name"
                  inputType="name"
                  placeholder={t('auth:enterLastName')}
                  formProps={formProps}
                  onSubmitEditing={onEmailFocus}
                />
                <FormTextInput
                  ref={(refs): void => {
                    this.email = refs;
                  }}
                  name="email"
                  label="Email"
                  inputType="email"
                  placeholder={t('auth:enterEmail')}
                  formProps={formProps}
                  onSubmitEditing={onPhoneNumberFocus}
                />
                <FormTextInput
                  ref={(refs): void => {
                    this.phone = refs;
                  }}
                  name="phone"
                  label="Phone"
                  inputType="phone"
                  maxLength={10}
                  inputPrefixText={countryCode}
                  placeholder={t('auth:yourNumber')}
                  helpText={t('auth:otpVerification')}
                  onPhoneCodeChange={this.handlePhoneCodeChange}
                  phoneFieldDropdownText={t('auth:countryRegion')}
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
                  helpText={t('auth:passwordValidation')}
                  formProps={formProps}
                />
                <TermsCondition onPressLink={onPressLink} />
                <FormButton
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  formProps={formProps}
                  type="primary"
                  title={t('auth:signup')}
                  containerStyle={styles.submitStyle}
                  testID={testID}
                />
              </>
            );
          }}
        </Formik>
      </View>
    );
  }

  private handlePhoneCodeChange = (countryCode: string): void => {
    this.setState({ countryCode });
  };

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

  public handleSubmit = (values: IFormData, formActions: FormikHelpers<IFormData>): void => {
    const { onSubmitFormSuccess } = this.props;
    const { countryCode } = this.state;
    formActions.setSubmitting(true);
    const signUpData: ISignUpPayload = {
      first_name: values.firstName,
      ...(values.lastName && { last_name: values.lastName }),
      email: values.email,
      phone_code: countryCode,
      phone_number: values.phone,
      password: values.password,
    };
    const phoneRef = (): FormTextInput | null => this.phone;
    onSubmitFormSuccess(signUpData, phoneRef);
    formActions.setSubmitting(false);
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
