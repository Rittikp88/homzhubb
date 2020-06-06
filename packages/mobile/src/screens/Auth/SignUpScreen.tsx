import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { UserService } from '@homzhub/common/src/services/UserService';
import { AnimatedHeader, FormTextInput, SignUpForm, SocialMediaComponent } from '@homzhub/common/src/components';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { ISocialMediaProvider } from '@homzhub/common/src/domain/models/SocialMediaProvider';
import { IUser } from '@homzhub/common/src/domain/models/User';

interface IDispatchProps {
  getSocialMedia: () => void;
  loginSuccess: (data: IUser) => void;
}

interface IStateProps {
  socialMediaProviders: ISocialMediaProvider[];
}

interface ISignUpState {
  isNewUser: boolean;
}

type libraryProps = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.SignUp>;
type Props = IStateProps & IDispatchProps & libraryProps;

class SignUpScreen extends Component<Props, ISignUpState> {
  public state = {
    isNewUser: false,
  };

  public componentDidMount(): void {
    const { getSocialMedia } = this.props;
    getSocialMedia();
  }

  public render(): React.ReactNode {
    const { socialMediaProviders, t, loginSuccess, navigation } = this.props;

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
    UserService.checkEmailExists(formData.email)
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

    UserService.checkPhoneNumberExists(phone)
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
)(withTranslation()(SignUpScreen));
