/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { CommonService } from '@homzhub/common/src/services/CommonService';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormButton, IDropdownOption, FormTextInput, TermsCondition } from '@homzhub/common/src/components';
import { BottomSheetListView } from '@homzhub/mobile/src/components/molecules/BottomSheetListView';

interface ISignUpFormProps extends WithTranslation {
  testID?: string;
  onPressLink: () => void;
  onSubmitFormSuccess: (payload: ISignUpPayload, ref: () => FormTextInput | null) => void;
}

interface IFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface ISignUpFormState {
  user: IFormData;
  countryCode: string;
  isBottomSheetVisible: boolean;
  countryCodeData: IDropdownOption[];
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
    countryCode: '+91',
    isBottomSheetVisible: false,
    countryCodeData: [],
  };

  public render(): React.ReactNode {
    const { t, testID, onPressLink } = this.props;
    const { user, countryCode, isBottomSheetVisible, countryCodeData } = this.state;

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
                    this.name = refs;
                  }}
                  name="name"
                  label="Name"
                  inputType="name"
                  placeholder={t('auth:enterName')}
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
                  onIconPress={this.handleDropdown}
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
        <BottomSheetListView
          data={countryCodeData}
          selectedValue={countryCode}
          listTitle={t('auth:countryRegion')}
          isBottomSheetVisible={isBottomSheetVisible}
          onCloseDropDown={this.onCloseDropDown}
          onSelectItem={this.handleSelection}
        />
      </View>
    );
  }

  private onCloseDropDown = (): void => {
    this.setState({ isBottomSheetVisible: false });
  };

  private handleSelection = (value: string): void => {
    const { isBottomSheetVisible } = this.state;
    this.setState({ countryCode: value, isBottomSheetVisible: !isBottomSheetVisible });
  };

  private handleDropdown = (): void => {
    const { isBottomSheetVisible } = this.state;
    CommonService.getCountryWithCode()
      .then((res) => {
        this.setState({ countryCodeData: res });
      })
      .catch((e) => {
        AlertHelper.error({ message: e.message });
      });
    this.setState({ isBottomSheetVisible: !isBottomSheetVisible });
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
      full_name: values.name,
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
