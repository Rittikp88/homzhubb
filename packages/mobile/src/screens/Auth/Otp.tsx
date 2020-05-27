import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserService } from '@homzhub/common/src/services/UserService';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Header, Label, OtpTimer, Text } from '@homzhub/common/src/components';
import { OtpInputs } from '@homzhub/mobile/src/components/molecules/OtpInputs';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IEmailLoginPayload, IOtpLoginPayload, LoginTypes } from '@homzhub/common/src/domain/repositories/interfaces';

interface IDispatchProps {
  login: (payload: IEmailLoginPayload | IOtpLoginPayload) => void;
}

type libraryProps = NavigationScreenProps<AuthStackParamList, ScreensKeys.OTP> & WithTranslation;
type IProps = IDispatchProps & libraryProps;

interface IState {
  error: boolean;
}

class Otp extends React.PureComponent<IProps, IState> {
  public state = {
    error: false,
  };

  public componentDidMount = async (): Promise<void> => {
    // await this.fetchOtp();
  };

  public render = (): React.ReactNode => {
    const {
      t,
      navigation: { goBack },
      route: { params },
    } = this.props;
    const { error } = this.state;
    const title = params?.title ?? t('verifyNumber');
    const phone = params?.phone ?? '';

    const toggleError = (): void => {
      this.toggleErrorState(false);
    };

    return (
      <SafeAreaView style={styles.screen}>
        <Header icon="left-arrow" onIconPress={goBack} headerContainerStyle={styles.headerStyle} />
        <View style={styles.container}>
          <Text type="large" textType="semiBold">
            {title}
          </Text>
          <Label style={styles.subTitle} type="large" textType="regular">
            {t('enterOTP')}
          </Label>
          <View style={styles.numberContainer}>
            <Text type="small" textType="semiBold">
              {phone}
            </Text>
            <Icon
              name="note-book"
              size={16}
              color={theme.colors.active}
              style={styles.icon}
              onPress={this.onIconPress}
            />
          </View>
          <OtpInputs error={error ? t('otpError') : undefined} bubbleOtp={this.verifyOtp} toggleError={toggleError} />
          <OtpTimer onResentPress={this.fetchOtp} />
        </View>
      </SafeAreaView>
    );
  };

  private onIconPress = (): void => {
    const {
      navigation,
      route: { params },
    } = this.props;

    if (params && params.ref) {
      params.ref.focus();
    }

    navigation.goBack();
  };

  private onVerifySuccess = async (): Promise<void> => {
    const {
      route: {
        params: { type },
      },
    } = this.props;

    switch (type) {
      case OtpNavTypes.SignUp:
        await this.signUp();
        break;
      case OtpNavTypes.Login:
        this.loginOtp();
        break;
      default:
      case OtpNavTypes.SocialMedia:
        break;
    }
  };

  private fetchOtp = async (): Promise<void> => {
    try {
      await UserService.fetchOtp();
    } catch (e) {
      AlertHelper.error({
        message: e.message,
      });
    }
  };

  private verifyOtp = async (otp: string): Promise<void> => {
    await this.onVerifySuccess();
    // try {
    //   await UserService.verifyOtp();
    //   this.onVerifySuccess();
    // } catch (e) {
    //   this.toggleErrorState(true);
    //   AlertHelper.error({
    //     message: e.message,
    //   });
    // }
  };

  private signUp = async (): Promise<void> => {
    const {
      login,
      route: {
        params: { userData },
      },
    } = this.props;

    if (!userData) {
      return;
    }

    try {
      await UserService.signUpService(userData);
      const loginData: IEmailLoginPayload = {
        action: LoginTypes.EMAIL,
        payload: {
          email: userData.email,
          password: userData.password,
        },
      };
      login(loginData);
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  private loginOtp = (): void => {
    const {
      login,
      route: {
        params: { phone, countryCode },
      },
    } = this.props;

    const loginData: IOtpLoginPayload = {
      action: LoginTypes.OTP,
      payload: {
        country_code: countryCode,
        phone_number: phone,
        otp: '123456',
      },
    };
    login(loginData);
  };

  private toggleErrorState = (error: boolean): void => {
    this.setState({ error });
  };
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { login } = UserActions;
  return bindActionCreators(
    {
      login,
    },
    dispatch
  );
};

export default connect<null, IDispatchProps, WithTranslation, IState>(
  null,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.auth)(Otp));

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    flex: 1,
    marginTop: theme.layout.screenPaddingTop,
    marginHorizontal: theme.layout.screenPadding,
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subTitle: {
    marginVertical: 8,
    color: theme.colors.darkTint3,
  },
  icon: {
    marginStart: 8,
  },
  headerStyle: {
    marginTop: 0,
  },
});
