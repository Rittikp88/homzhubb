import React, { Component } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { Header, FormTextInput, SignUpForm, SocialMediaComponent } from '@homzhub/common/src/components';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IUser } from '@homzhub/common/src/domain/models/User';
import { SocialMediaProvider } from '@homzhub/common/src/domain/models/SocialMediaProvider';

interface IDispatchProps {
  getSocialMedia: () => void;
  loginSuccess: (data: IUser) => void;
}

interface IStateProps {
  socialMediaProviders: SocialMediaProvider[];
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
    const { socialMediaProviders, t, loginSuccess, navigation } = this.props;

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
            <SignUpForm onSubmitFormSuccess={this.onFormSubmit} />
            <SocialMediaComponent
              isFromLogin={false}
              socialMediaItems={socialMediaProviders}
              onLoginSuccessAction={loginSuccess}
              navigation={navigation}
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
          onLinkPress={this.onLoginPress}
          onIconPress={this.onClosePress}
        />
      </>
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

  private onFormSubmit = (formData: ISignUpPayload, ref: FormTextInput | null): void => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  scrollViewContent: {
    marginTop: theme.headerConstants.headerMaxHeight,
  },
});
