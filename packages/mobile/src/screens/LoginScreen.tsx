import React, { Component } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { IUserState } from '@homzhub/common/src/modules/user/interface';
import { ILoginFormData, ISocialLoginPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { UserService } from '@homzhub/common/src/services/UserService';
import { theme } from '@homzhub/common/src/styles/theme';
import { Header, LoginView } from '@homzhub/common/src/components';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';

interface IDispatchProps {
  getSocialMedia: () => void;
  loginSuccess: (data: any) => void;
}

interface IStateProps {
  user: IUserState;
}

interface ISignUpState {
  animatedValue: Animated.Value;
}

type libraryProps = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.Login>;
type Props = IStateProps & IDispatchProps & libraryProps;

class LoginScreen extends Component<Props, ISignUpState> {
  public state = {
    animatedValue: new Animated.Value(0),
  };

  public componentDidMount(): void {
    const { getSocialMedia } = this.props;
    getSocialMedia();
  }

  public render(): React.ReactNode {
    const { animatedValue } = this.state;
    const { t, user } = this.props;

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
            <LoginView
              onEmailLogin={this.handleEmailLoginPress}
              onSocialLoginSuccess={this.handleSocialLogin}
              socialMediaItems={user.socialProviders}
              handleLoginSuccess={this.handleLoginFormSubmit}
            />
          </View>
        </ScrollView>
        <Header
          isAnimation
          icon="close"
          title={t('login')}
          subTitle={t('auth:newAroundHere')}
          linkText={t('auth:signup')}
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

  private handleEmailLoginPress = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.EmailLogin);
  };

  private handleLinkPress = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.SignUp);
  };

  private handleSocialLogin = (response: any): void => {
    const { navigation, t, loginSuccess } = this.props;
    const {
      provider,
      // eslint-disable-next-line @typescript-eslint/camelcase
      user: { email, givenName, first_name, last_name },
      idToken,
    } = response;
    const title = provider === 'GOOGLE' ? t('auth:loginWithGoogle') : t('auth:loginWithFacebook');
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
              message: t('auth:enterNumberForProfileForLogin', { givenName: name }) ?? '',
              buttonTitle: t('common:login'),
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

  private handleLoginFormSubmit = (values: ILoginFormData): void => {
    const { navigation, t } = this.props;
    navigation.navigate(ScreensKeys.OTP, {
      type: OtpNavTypes.Login,
      title: t('auth:loginOtp'),
      countryCode: values.country_code,
      phone: values.phone_number,
      ref: null,
    });
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
)(withTranslation()(LoginScreen));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollViewContent: {
    marginTop: theme.headerConstants.headerMaxHeight,
  },
});
