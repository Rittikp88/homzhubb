import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton, FormTextInput, TermsCondition } from '@homzhub/common/src/components';

interface ISignUpFormProps extends WithTranslation {
  testID?: string;
  onPressLink: () => void;
  onSubmitFormSuccess: (payload: ISignUpPayload) => void;
}

interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phone: string;
  password: string;
}

class SignUpForm extends PureComponent<ISignUpFormProps, IFormData> {
  public lastName: React.RefObject<any> = React.createRef();
  public email: React.RefObject<any> = React.createRef();
  public phone: React.RefObject<any> = React.createRef();

  public state = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    phoneCode: '',
  };

  public render(): React.ReactNode {
    const { t, testID, onPressLink } = this.props;

    return (
      <View style={styles.container}>
        <Formik<IFormData>
          initialValues={{ ...this.state }}
          validate={FormUtils.validate(this.formSchema)}
          onSubmit={this.handleSubmit}
        >
          {(formProps: FormikProps<IFormData>): React.ReactNode => {
            const onEmailFocus = (): void => this.email.current?.focus();
            const onLastNameFocus = (): void => this.lastName.current?.focus();
            const onPhoneNumberFocus = (): void => this.phone.current?.focus();

            return (
              <>
                <FormTextInput
                  name="firstName"
                  label="First Name"
                  inputType="name"
                  placeholder={t('auth:enterFirstName')}
                  formProps={formProps}
                  isMandatory
                  onSubmitEditing={onLastNameFocus}
                />
                <FormTextInput
                  ref={this.lastName}
                  name="lastName"
                  label="Last Name"
                  inputType="name"
                  placeholder={t('auth:enterLastName')}
                  formProps={formProps}
                  onSubmitEditing={onEmailFocus}
                />
                <FormTextInput
                  ref={this.email}
                  name="email"
                  label="Email"
                  inputType="email"
                  isMandatory
                  placeholder={t('auth:enterEmail')}
                  formProps={formProps}
                  onSubmitEditing={onPhoneNumberFocus}
                />
                <FormTextInput
                  ref={this.phone}
                  name="phone"
                  label="Phone"
                  isMandatory
                  inputType="phone"
                  maxLength={10}
                  inputPrefixText={formProps.values.phoneCode}
                  placeholder={t('auth:yourNumber')}
                  helpText={t('auth:otpVerification')}
                  phoneFieldDropdownText={t('auth:countryRegion')}
                  formProps={formProps}
                />
                <FormTextInput
                  name="password"
                  label="Password"
                  inputType="password"
                  isMandatory
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

  private formSchema = (): yup.ObjectSchema<IFormData> => {
    const { t } = this.props;
    return yup.object().shape({
      firstName: yup.string().matches(FormUtils.nameRegex, t('auth:onlyAlphabets')).required(t('auth:nameRequired')),
      lastName: yup.string(),
      email: yup.string().email(t('auth:emailValidation')).required(t('auth:emailRequired')),
      phoneCode: yup.string(),
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
    formActions.setSubmitting(true);
    const signUpData: ISignUpPayload = {
      first_name: values.firstName,
      ...(values.lastName && { last_name: values.lastName }),
      email: values.email,
      phone_code: values.phoneCode,
      phone_number: values.phone,
      password: values.password,
    };

    onSubmitFormSuccess(signUpData);
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
