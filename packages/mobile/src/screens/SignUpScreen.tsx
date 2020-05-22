import React, { Component } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { IUserState } from '@homzhub/common/src/modules/user/interface';
import { theme } from '@homzhub/common/src/styles/theme';
import { SignupView, Button, Header } from '@homzhub/common/src/components';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IDispatchProps {
  getSocialMedia: () => void;
}

interface IStateProps {
  user: IUserState;
}

interface ISignUpState {
  animatedValue: Animated.Value;
}

type libraryProps = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.SignUp>;
type Props = IStateProps & IDispatchProps & libraryProps;

class SignUpScreen extends Component<Props, ISignUpState> {
  public state = {
    animatedValue: new Animated.Value(0),
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
            <SignupView socialMediaItems={user.data} onSocialSignUpSuccess={this.handleSocialSignUp} />
            <Button type="primary" title="OTP" onPress={this.onPress} />
            <Button type="primary" title="Forgot Password" onPress={this.onForgotPassword} />
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

  private onPress = (): void => {
    const { navigation } = this.props;
    // TODO: Take value from form
    navigation.navigate(ScreensKeys.OTP, {
      phone: '+91 9008004265',
    });
  };

  public onForgotPassword = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.ForgotPassword);
  };

  private onClosePress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private handleLinkPress = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.Login);
  };

  // TODO: need to add response type
  private handleSocialSignUp = (resposne: any): void => {
    const { navigation, t } = this.props;
    const {
      user: { email, givenName },
    } = resposne;
    navigation.navigate(ScreensKeys.MobileVerification, {
      title: t('auth:signUpWithGoogle'),
      subTitle: email,
      icon: 'left-arrow',
      message: t('auth:enterNumberForProfile', { givenName }),
      buttonTitle: t('signUp'),
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
