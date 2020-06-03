import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { ILoginFormData } from '@homzhub/common/src/domain/repositories/interfaces';
import { FormTextInput, AnimatedHeader, LoginForm, SocialMediaComponent } from '@homzhub/common/src/components';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IUser } from '@homzhub/common/src/domain/models/User';
import { ISocialMediaProvider } from '@homzhub/common/src/domain/models/SocialMediaProvider';

interface IDispatchProps {
  getSocialMedia: () => void;
  loginSuccess: (data: IUser) => void;
}

interface IStateProps {
  socialMediaProviders: ISocialMediaProvider[];
}

type libraryProps = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.Login>;
type Props = IStateProps & IDispatchProps & libraryProps;

class LoginScreen extends Component<Props> {
  public componentDidMount(): void {
    const { getSocialMedia } = this.props;
    getSocialMedia();
  }

  public render(): React.ReactNode {
    const { t, socialMediaProviders, loginSuccess, navigation } = this.props;

    return (
      <AnimatedHeader
        title={t('login')}
        subTitle={t('auth:newAroundHere')}
        linkText={t('auth:signup')}
        onIconPress={this.onClosePress}
        onLinkPress={this.onSignUpClicked}
      >
        <>
          <LoginForm onLoginSuccess={this.onOtpLoginPress} />
          <SocialMediaComponent
            isFromLogin
            onLoginSuccessAction={loginSuccess}
            socialMediaItems={socialMediaProviders}
            onEmailLogin={this.onEmailLoginPress}
            navigation={navigation}
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
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    socialMediaProviders: UserSelector.getSocialMediaProviders(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { getSocialMedia, loginSuccess } = UserActions;
  return bindActionCreators(
    {
      getSocialMedia,
      loginSuccess,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, WithTranslation, IState>(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(LoginScreen));
