import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AnimatedHeader, SignUpForm, SocialMediaComponent } from '@homzhub/mobile/src/components';

interface ISignUpState {
  isNewUser: boolean;
}

type Props = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.SignUp>;

export class SignUpScreen extends Component<Props, ISignUpState> {
  public state = {
    isNewUser: false,
  };

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

  private onFormSubmit = (formData: ISignUpPayload): void => {
    const {
      navigation,
      t,
      route: { params },
    } = this.props;
    const { isNewUser } = this.state;
    this.validateUser(formData);

    if (isNewUser) {
      navigation.navigate(ScreensKeys.OTP, {
        type: OtpNavTypes.SignUp,
        title: t('auth:verifyNumber'),
        countryCode: formData.phone_code,
        otpSentTo: formData.phone_number,
        userData: formData,
        ...(params && params.onCallback && { onCallback: params.onCallback }),
      });
    }
  };

  // TODO: (Shikha) - Replace url once BE ready
  private handleTermsCondition = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.WebViewScreen, { url: 'https://www.homzhub.com/privacyPolicy' });
  };

  private validateUser = (formData: ISignUpPayload): void => {
    const { t } = this.props;
    const phone = `${formData.phone_code}~${formData.phone_number}`;
    UserRepository.emailExists(formData.email)
      .then((res: any) => {
        if (res && res.is_exists) {
          AlertHelper.error({ message: t('auth:emailAlreadyExists') });
          this.setState({ isNewUser: false });
        } else {
          this.setState({ isNewUser: true });
        }
      })
      .catch((e: any) => {
        AlertHelper.error({ message: e });
      });

    UserRepository.phoneExists(phone)
      .then((res: any) => {
        if (res && res.is_exists) {
          AlertHelper.error({ message: t('auth:phoneAlreadyExists') });
          this.setState({ isNewUser: false });
        } else {
          this.setState({ isNewUser: true });
        }
      })
      .catch((e: any) => {
        AlertHelper.error({ message: e });
      });
  };
}

export default withTranslation()(SignUpScreen);
