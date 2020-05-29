import React, { Component } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { ILoginFormData } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { FormTextInput, Header, LoginForm, SocialMediaComponent } from '@homzhub/common/src/components';
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
    const { t, socialMediaProviders, loginSuccess, navigation } = this.props;

    return (
      <>
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedValue } } }], {
            useNativeDriver: false,
          })}
        >
          <View style={styles.scrollViewContent}>
            <LoginForm onLoginSuccess={this.onOtpLoginPress} />
            <SocialMediaComponent
              isFromLogin
              onLoginSuccessAction={loginSuccess}
              socialMediaItems={socialMediaProviders}
              onEmailLogin={this.onEmailLoginPress}
              navigation={navigation}
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
          onLinkPress={this.onSignUpClicked}
          onIconPress={this.onClosePress}
        />
      </>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollViewContent: {
    marginTop: theme.headerConstants.headerMaxHeight,
  },
});
