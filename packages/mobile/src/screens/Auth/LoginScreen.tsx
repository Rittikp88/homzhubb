import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { ILoginFormData } from '@homzhub/common/src/domain/repositories/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AnimatedHeader, LoginForm, SocialMediaComponent } from '@homzhub/mobile/src/components';
import { SocialMediaProvider } from '@homzhub/common/src/domain/models/SocialMediaProvider';
import { IUserTokens } from '@homzhub/common/src/services/storage/StorageService';

interface IDispatchProps {
  loginSuccess: (data: IUserTokens) => void;
}

interface ILoginScreenState {
  socialMediaProviders: SocialMediaProvider[];
}

type libraryProps = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.Login>;
type Props = IDispatchProps & libraryProps;

export class LoginScreen extends Component<Props, ILoginScreenState> {
  public state = {
    socialMediaProviders: [],
  };

  public async componentDidMount(): Promise<void> {
    await this.fetchSocialMedia();
  }

  public render(): React.ReactNode {
    const { t, loginSuccess, navigation } = this.props;
    const { socialMediaProviders } = this.state;

    return (
      <AnimatedHeader
        title={t('login')}
        subTitle={t('auth:newAroundHere')}
        linkText={t('auth:signup')}
        onIconPress={this.onClosePress}
        onLinkPress={this.onSignUpClicked}
        testID="headerEvents"
      >
        <>
          <LoginForm onLoginSuccess={this.onOtpLoginPress} testID="loginForm" />
          <SocialMediaComponent
            isFromLogin
            onLoginSuccessAction={loginSuccess}
            socialMediaItems={socialMediaProviders}
            onEmailLogin={this.onEmailLoginPress}
            navigation={navigation}
            testID="socialEmailLogin"
          />
        </>
      </AnimatedHeader>
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

  private fetchSocialMedia = async (): Promise<void> => {
    try {
      const response = await CommonRepository.getSocialMedia();
      this.setState({ socialMediaProviders: response });
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };
}

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { loginSuccess } = UserActions;
  return bindActionCreators(
    {
      loginSuccess,
    },
    dispatch
  );
};

export default connect<{}, IDispatchProps, WithTranslation, IState>(
  null,
  mapDispatchToProps
)(withTranslation()(LoginScreen));
