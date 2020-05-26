import React, { Component } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { IUserState } from '@homzhub/common/src/modules/user/interface';
import { ISignUpPayload, ISocialLoginPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { UserService } from '@homzhub/common/src/services/UserService';
import { theme } from '@homzhub/common/src/styles/theme';
import { SignupView, Header, FormTextInput } from '@homzhub/common/src/components';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IDispatchProps {
  getSocialMedia: () => void;
  loginSuccess: (data: any) => void;
}

interface IStateProps {
  user: IUserState;
}

interface ISignUpState {
  animatedValue: Animated.Value;
  isNewUser: boolean;
}

type libraryProps = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.SignUp>;
type Props = IStateProps & IDispatchProps & libraryProps;

class SignUpScreen extends Component<Props, ISignUpState> {
  public state = {
    animatedValue: new Animated.Value(0),
    isNewUser: false,
  };

  public componentDidMount(): void {
    const { getSocialMedia } = this.props;
    getSocialMedia();
  }

  public render(): React.ReactNode {
    const { animatedValue } = this.state;
    const { user, t } = this.props;

    return (
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
            useNativeDriver: false,
          })}
        >
          <View style={styles.scrollViewContent}>
            <SignupView
              socialMediaItems={user.socialProviders}
              onSocialSignUpSuccess={this.handleSocialSignUp}
              onSubmitForm={this.handleFormSubmit}
            />
          </View>
        </ScrollView>
        <Header
          isAnimation
          icon="close"
          title={t('signUp')}
          subTitle={t('auth:alreadyRegistered')}
          linkText={t('login')}
          animatedValue={animatedValue}
          onLinkPress={this.handleLinkPress}
          onIconPress={this.onClosePress}
        />
      </View>
    );
  }

  private onClosePress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private handleLinkPress = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.Login);
  };

  // TODO: need to add response type
  private handleSocialSignUp = (response: any): void => {
    const { navigation, t, loginSuccess } = this.props;
    const {
      provider,
      // eslint-disable-next-line @typescript-eslint/camelcase
      user: { email, givenName, first_name, last_name },
      idToken,
    } = response;
    const title = provider === 'GOOGLE' ? t('auth:signUpWithGoogle') : t('auth:signUpWithFacebook');
    // eslint-disable-next-line @typescript-eslint/camelcase
    const name = provider === 'GOOGLE' ? givenName : `${first_name} ${last_name}`;

    const socialLoginData: ISocialLoginPayload = {
      action: 'SOCIAL_LOGIN',
      payload: {
        provider,
        id_token: idToken,
      },
    };
    try {
      UserService.socialLogin(socialLoginData)
        .then((data) => {
          if (data.is_new_user) {
            navigation.navigate(ScreensKeys.MobileVerification, {
              title: title ?? '',
              subTitle: email,
              icon: 'left-arrow',
              message: t('auth:enterNumberForProfileForSignup', { givenName: name }) ?? '',
              buttonTitle: t('signUp'),
            });
          } else {
            const loginSuccessObject = {
              access_token: data.payload.access_token,
              refresh_token: data.payload.refresh_token,
              ...data.payload.user,
            };
            loginSuccess(loginSuccessObject);
          }
        })
        .catch((err) => {
          AlertHelper.error({ message: err });
        });
    } catch (err) {
      AlertHelper.error({ message: err });
    }
  };

  private handleFormSubmit = (formData: ISignUpPayload, ref: FormTextInput | null): void => {
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
    try {
      UserService.checkEmailExists(formData.email)
        .then((res) => {
          if (res.data && res.data.is_exists) {
            AlertHelper.error({ message: t('auth:emailAlreadyExists') });
            this.setState({ isNewUser: false });
          } else {
            this.setState({ isNewUser: true });
          }
        })
        .catch((e) => {
          AlertHelper.error({ message: e });
        });
    } catch (e) {
      AlertHelper.error({ message: e });
    }

    try {
      UserService.checkPhoneNumberExists(phone)
        .then((res) => {
          if (res.data && res.data.is_exists) {
            AlertHelper.error({ message: t('auth:phoneAlreadyExists') });
            this.setState({ isNewUser: false });
          } else {
            this.setState({ isNewUser: true });
          }
        })
        .catch((e) => {
          AlertHelper.error({ message: e });
        });
    } catch (e) {
      AlertHelper.error({ message: e });
    }
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  const { user } = state;
  return {
    user,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollViewContent: {
    marginTop: theme.headerConstants.headerMaxHeight,
  },
});
