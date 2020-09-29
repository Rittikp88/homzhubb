import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Formik, FormikHelpers, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ILoginFormData } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { CommonService } from '@homzhub/common/src/services/CommonService';
import { Button, FormButton, FormTextInput, IDropdownOption } from '@homzhub/common/src/components';
import { BottomSheetListView } from '@homzhub/mobile/src/components/molecules/BottomSheetListView';

interface ILoginFormProps extends WithTranslation {
  isEmailLogin?: boolean;
  handleForgotPassword?: () => void;
  onLoginSuccess: (payload: ILoginFormData, ref: () => FormTextInput | null) => void;
  testID?: string;
}

interface IFormData {
  email: string;
  phone: string;
  password: string;
  isEmailFlow: boolean;
}

interface ILoginFormState {
  user: IFormData;
  countryCode: string;
  isBottomSheetVisible: boolean;
  countryCodeData: IDropdownOption[];
}

class LoginForm extends Component<ILoginFormProps, ILoginFormState> {
  public email: FormTextInput | null = null;
  public phone: FormTextInput | null = null;
  public password: FormTextInput | null = null;

  public constructor(props: ILoginFormProps) {
    super(props);
    this.state = {
      user: {
        email: '',
        phone: '',
        password: '',
        isEmailFlow: props.isEmailLogin || false,
      },
      countryCode: '+91',
      isBottomSheetVisible: false,
      countryCodeData: [],
    };
  }

  public render(): React.ReactNode {
    const { t, handleForgotPassword, testID } = this.props;
    const { user, countryCode, isBottomSheetVisible, countryCodeData } = this.state;
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
                  testID={testID}
                />
              )}
            </>
          )}
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

  private renderLoginFields = (formProps: FormikProps<FormikValues>): React.ReactElement => {
    const { t } = this.props;
    const {
      user: { isEmailFlow },
      countryCode,
    } = this.state;
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
            inputPrefixText={countryCode}
            placeholder={t('auth:yourNumber')}
            helpText={t('auth:otpVerification')}
            onIconPress={this.handleDropdown}
            formProps={formProps}
          />
        )}
      </>
    );
  };

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

  public handleSubmit = (values: IFormData, formActions: FormikHelpers<IFormData>): void => {
    const { onLoginSuccess } = this.props;
    const { countryCode } = this.state;
    formActions.setSubmitting(true);
    const loginFormData: ILoginFormData = {
      email: values.email,
      password: values.password,
      country_code: countryCode,
      phone_number: values.phone,
    };

    const phoneRef = (): FormTextInput | null => this.phone;
    onLoginSuccess(loginFormData, phoneRef);
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
