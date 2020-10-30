import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { withTranslation, WithTranslation } from 'react-i18next';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { SocialMediaKeys } from '@homzhub/common/src/assets/constants';
import { FormTextInput, FormButton, DetailedHeader, Text } from '@homzhub/common/src/components';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IVerificationState {
  phone: string;
  phoneCode: string;
}

type Props = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.MobileVerification>;

export class MobileVerificationScreen extends Component<Props, IVerificationState> {
  public state = {
    phone: '',
    phoneCode: '',
  };

  public render(): React.ReactNode {
    const { t } = this.props;
    const { title, message, subTitle, buttonTitle } = this.getDisplayStrings();

    return (
      <View style={styles.container}>
        <DetailedHeader icon={icons.leftArrow} title={title} subTitle={subTitle} onIconPress={this.handleIconPress} />
        <View style={styles.content}>
          <Text type="small" style={styles.message}>
            {message}
          </Text>
          <Formik
            initialValues={{ ...this.state }}
            onSubmit={this.onSubmit}
            validate={FormUtils.validate(this.formSchema)}
          >
            {(formProps: FormikProps<IVerificationState>): React.ReactElement => (
              <>
                <FormTextInput
                  formProps={formProps}
                  inputType="phone"
                  name="phone"
                  label="Phone"
                  inputPrefixText={formProps.values.phoneCode}
                  isMandatory
                  phoneFieldDropdownText={t('auth:countryRegion')}
                  placeholder={t('yourNumber')}
                  helpText={t('otpVerification')}
                />
                <FormButton
                  // @ts-ignore
                  onPress={formProps.handleSubmit}
                  formProps={formProps}
                  type="primary"
                  title={buttonTitle}
                  containerStyle={styles.formButtonStyle}
                />
              </>
            )}
          </Formik>
        </View>
      </View>
    );
  }

  private onSubmit = (values: IVerificationState, formActions: FormikHelpers<IVerificationState>): void => {
    formActions.setSubmitting(true);
    const {
      t,
      route: {
        params: {
          isFromLogin,
          userData: {
            user: { first_name, last_name, email },
          },
          onCallback,
        },
      },
      navigation,
    } = this.props;
    const { phone, phoneCode } = values;

    navigation.navigate(ScreensKeys.OTP, {
      type: OtpNavTypes.SocialMedia,
      title: isFromLogin ? t('loginOtp') : t('verifyNumber'),
      phone,
      countryCode: phoneCode,
      userData: {
        full_name: `${first_name} ${last_name}`,
        email,
        phone_number: phone,
        phone_code: phoneCode,
        // TODO (Aditya 10-Jun-2020): How to solve this password issue?
        password: 'RandomPassword',
      },
      ...(onCallback && { onCallback }),
    });
  };

  private handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private getDisplayStrings = (): { title: string; subTitle: string; message: string; buttonTitle: string } => {
    const {
      t,
      route: {
        params: { userData, isFromLogin },
      },
    } = this.props;
    const {
      provider,
      user: { first_name, email },
    } = userData;

    let title = t('signUpWithFacebook');
    const messageKey = isFromLogin ? 'enterNumberForProfileForLogin' : 'enterNumberForProfileForSignUp';

    if (isFromLogin) {
      if (provider === SocialMediaKeys.Google) {
        title = t('loginWithGoogle');
      } else {
        title = t('loginWithFacebook');
      }
    }

    if (!isFromLogin && provider === SocialMediaKeys.Google) {
      title = t('signUpWithGoogle');
    }

    return {
      title,
      subTitle: email,
      buttonTitle: isFromLogin ? t('common:login') : t('common:signUp'),
      message: t(`${messageKey}`, { givenName: first_name }),
    };
  };

  private formSchema = (): yup.ObjectSchema<{ phone: string }> => {
    const { t } = this.props;
    return yup.object().shape({
      phone: yup.string().required(t('numberRequired')),
    });
  };
}

export default withTranslation(LocaleConstants.namespacesKey.auth)(MobileVerificationScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  message: {
    color: theme.colors.darkTint3,
    marginBottom: 12,
  },
  formButtonStyle: {
    flex: 0,
    marginVertical: 30,
  },
});
