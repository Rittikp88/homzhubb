import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { SignUpForm, SocialMediaComponent } from '@homzhub/mobile/src/components';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

type Props = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.SignUp>;

export class SignUpScreen extends Component<Props> {
  public render(): React.ReactNode {
    const {
      t,
      navigation,
      route: { params },
    } = this.props;

    return (
      <Screen
        headerProps={{
          type: 'secondary',
          icon: icons.close,
          onIconPress: this.onClosePress,
        }}
        pageHeaderProps={{
          contentTitle: t('signUp'),
          contentSubTitle: t('auth:alreadyRegistered'),
          contentLink: t('login'),
          onLinkPress: this.onLoginPress,
        }}
        backgroundColor={theme.colors.white}
        keyboardShouldPersistTaps
      >
        <>
          <SignUpForm
            onSubmitFormSuccess={this.onFormSubmit}
            onPressLink={this.handleTermsCondition}
            referralCode={params && params?.referralCode}
            testID="signupForm"
          />
          <SocialMediaComponent isFromLogin={false} navigation={navigation} />
        </>
      </Screen>
    );
  }

  private onClosePress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private onLoginPress = (): void => {
    const {
      navigation,
      route: { params },
    } = this.props;
    const onCallback = params && params.onCallback ? { onCallback: params.onCallback } : {};
    navigation.navigate(ScreensKeys.Login, onCallback);
  };

  private onFormSubmit = async (formData: ISignUpPayload): Promise<void> => {
    const {
      navigation,
      t,
      route: { params },
    } = this.props;

    try {
      const isEmailUsed = await UserRepository.emailExists(formData.email);
      if (isEmailUsed.is_exists) {
        AlertHelper.error({ message: t('auth:emailAlreadyExists') });
        return;
      }

      const phone = `${formData.phone_code}~${formData.phone_number}`;
      const isPhoneUsed = await UserRepository.phoneExists(phone);
      if (isPhoneUsed.is_exists) {
        AlertHelper.error({ message: t('auth:phoneAlreadyExists') });
        return;
      }

      if (formData.signup_referral_code) {
        const isValidCode = await UserRepository.verifyReferalCode(formData.signup_referral_code);
        if (!isValidCode.is_applicable) {
          AlertHelper.error({ message: t('auth:invalidReferralCodeError') });
          return;
        }
      }

      navigation.navigate(ScreensKeys.OTP, {
        type: OtpNavTypes.SignUp,
        title: t('auth:verifyNumber'),
        countryCode: formData.phone_code,
        otpSentTo: formData.phone_number,
        userData: formData,
        ...(params && params.onCallback && { onCallback: params.onCallback }),
      });
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }
  };

  private handleTermsCondition = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.WebViewScreen, { url: 'https://www.homzhub.com/privacyPolicy' });
  };
}

export default withTranslation()(SignUpScreen);
