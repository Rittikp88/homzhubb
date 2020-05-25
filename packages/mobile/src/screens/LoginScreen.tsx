import React, { Component } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { IUserState } from '@homzhub/common/src/modules/user/interface';
import { ILoginFormData } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { Header, LoginView } from '@homzhub/common/src/components';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IDispatchProps {
  getSocialMedia: () => void;
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
              socialMediaItems={user.data}
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
    const { navigation, t } = this.props;
    const {
      user: { email, givenName },
    } = response;
    navigation.navigate(ScreensKeys.MobileVerification, {
      title: t('auth:signUpWithGoogle') ?? '',
      subTitle: email,
      icon: 'left-arrow',
      message: t('auth:enterNumberForProfile', { givenName }) ?? '',
      buttonTitle: t('signUp'),
    });
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
  const { getSocialMedia } = UserActions;
  return bindActionCreators(
    {
      getSocialMedia,
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
