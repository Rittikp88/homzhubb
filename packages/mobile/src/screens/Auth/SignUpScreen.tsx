import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AnimatedHeader, SignUpForm, SocialMediaComponent } from '@homzhub/mobile/src/components';

type Props = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.SignUp>;

export class SignUpScreen extends Component<Props> {
  public render(): React.ReactNode {
    const { t, navigation } = this.props;

    return (
      <AnimatedHeader
        title={t('signUp')}
        subTitle={t('auth:alreadyRegistered')}
        linkText={t('login')}
        onIconPress={this.onClosePress}
        onLinkPress={this.onLoginPress}
        testID="headerEvents"
        keyboardShouldPersistTaps
      >
        <>
          <SignUpForm
            onSubmitFormSuccess={this.onFormSubmit}
            onPressLink={this.handleTermsCondition}
            testID="signupForm"
          />
          <SocialMediaComponent isFromLogin={false} navigation={navigation} />
        </>
      </AnimatedHeader>
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
