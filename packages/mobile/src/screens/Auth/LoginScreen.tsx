import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { LoginForm, SocialMediaComponent } from '@homzhub/mobile/src/components';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { ILoginFormData } from '@homzhub/common/src/domain/repositories/interfaces';

type Props = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.Login>;

export class LoginScreen extends Component<Props> {
  public render(): React.ReactNode {
    const { t, navigation } = this.props;

    return (
      <Screen
        headerProps={{
          type: 'secondary',
          icon: icons.close,
          onIconPress: this.onClosePress,
        }}
        pageHeaderProps={{
          contentTitle: t('login'),
          contentSubTitle: t('auth:newAroundHere'),
          contentLink: t('auth:signup'),
          onLinkPress: this.onSignUpClicked,
        }}
        backgroundColor={theme.colors.white}
      >
        <>
          <LoginForm onLoginSuccess={this.onOtpLoginPress} testID="loginForm" />
          <SocialMediaComponent
            isFromLogin
            onEmailLogin={this.onEmailLoginPress}
            navigation={navigation}
            testID="socialEmailLogin"
          />
        </>
      </Screen>
    );
  }

  private onClosePress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private onEmailLoginPress = (): void => {
    const {
      navigation,
      route: { params },
    } = this.props;
    const onCallback = params && params.onCallback ? { onCallback: params.onCallback } : {};
    navigation.navigate(ScreensKeys.EmailLogin, onCallback);
  };

  private onSignUpClicked = (): void => {
    const {
      navigation,
      route: { params },
    } = this.props;
    const onCallback = params && params.onCallback ? { onCallback: params.onCallback } : {};
    navigation.navigate(ScreensKeys.SignUp, onCallback);
  };

  private onOtpLoginPress = (values: ILoginFormData): void => {
    const {
      navigation,
      t,
      route: { params },
    } = this.props;
    navigation.navigate(ScreensKeys.OTP, {
      type: OtpNavTypes.Login,
      title: t('auth:loginOtp'),
      countryCode: values.phone_code,
      otpSentTo: values.phone_number,
      ...(params && params.onCallback && { onCallback: params.onCallback }),
    });
  };
}

export default withTranslation()(LoginScreen);
