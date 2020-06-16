import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { AnimatedHeader, FormTextInput, SignUpForm, SocialMediaComponent } from '@homzhub/common/src/components';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { ISocialMediaProvider } from '@homzhub/common/src/domain/models/SocialMediaProvider';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IUser } from '@homzhub/common/src/domain/models/User';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IDispatchProps {
  loginSuccess: (data: IUser) => void;
}

interface ISignUpState {
  isNewUser: boolean;
  socialMediaProviders: ISocialMediaProvider[];
}

type libraryProps = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.SignUp>;
type Props = IDispatchProps & libraryProps;

class SignUpScreen extends Component<Props, ISignUpState> {
  public state = {
    isNewUser: false,
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
        title={t('signUp')}
        subTitle={t('auth:alreadyRegistered')}
        linkText={t('login')}
        onIconPress={this.onClosePress}
        onLinkPress={this.onLoginPress}
      >
        <>
          <SignUpForm onSubmitFormSuccess={this.onFormSubmit} />
          <SocialMediaComponent
            isFromLogin={false}
            socialMediaItems={socialMediaProviders}
            onLoginSuccessAction={loginSuccess}
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

  private onLoginPress = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.Login);
  };

  private onFormSubmit = (formData: ISignUpPayload, ref: () => FormTextInput | null): void => {
    const { navigation, t } = this.props;
    const { isNewUser } = this.state;
    this.validateUser(formData);

    if (isNewUser) {
      navigation.navigate(ScreensKeys.OTP, {
        type: OtpNavTypes.SignUp,
        title: t('auth:verifyNumber'),
        countryCode: formData.country_code,
        phone: formData.phone_number,
        userData: formData,
        ref,
      });
    }
  };

  private validateUser = (formData: ISignUpPayload): void => {
    const { t } = this.props;
    const phone = `${formData.country_code}~${formData.phone_number}`;
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

  private fetchSocialMedia = async (): Promise<void> => {
    try {
      const response = await UserRepository.getSocialMedia();
      this.setState({ socialMediaProviders: response });
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
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
)(withTranslation()(SignUpScreen));
