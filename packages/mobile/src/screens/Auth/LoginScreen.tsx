import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { FormTextInput, AnimatedHeader, LoginForm, SocialMediaComponent } from '@homzhub/common/src/components';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { ILoginFormData } from '@homzhub/common/src/domain/repositories/interfaces';
import { IUser } from '@homzhub/common/src/domain/models/User';
import { ISocialMediaProvider } from '@homzhub/common/src/domain/models/SocialMediaProvider';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IDispatchProps {
  loginSuccess: (data: IUser) => void;
}

interface ILoginScreenState {
  socialMediaProviders: ISocialMediaProvider[];
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
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.EmailLogin);
  };

  private onSignUpClicked = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.SignUp);
  };

  private onOtpLoginPress = (values: ILoginFormData, ref: () => FormTextInput | null): void => {
    const { navigation, t } = this.props;
    navigation.navigate(ScreensKeys.OTP, {
      type: OtpNavTypes.Login,
      title: t('auth:loginOtp'),
      countryCode: values.country_code,
      phone: values.phone_number,
      ref,
    });
  };

  private fetchSocialMedia = async (): Promise<void> => {
    try {
      const response = await UserRepository.getSocialMedia();
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
