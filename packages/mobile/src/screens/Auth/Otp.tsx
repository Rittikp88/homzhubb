import React, { ReactElement } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { StringUtils } from '@homzhub/common/src/utils/StringUtils';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { IUserTokens, StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { UserService } from '@homzhub/common/src/services/UserService';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { IState } from '@homzhub/common/src/modules/interfaces';
import {
  IEmailLoginPayload,
  ILoginPayload,
  IOtpLoginPayload,
  LoginTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { OtpTimer } from '@homzhub/common/src/components/atoms/OtpTimer';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { DetailedHeader } from '@homzhub/common/src/components/molecules/DetailedHeader';
import { Loader, OtpInputs, OtpTypes } from '@homzhub/mobile/src/components';
import { User } from '@homzhub/common/src/domain/models/User';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IStateProps {
  isLoading: boolean;
}

interface IDispatchProps {
  login: (payload: ILoginPayload) => void;
  loginSuccess: (data: IUserTokens) => void;
}

type libraryProps = NavigationScreenProps<AuthStackParamList, ScreensKeys.OTP> & WithTranslation;
type IProps = IDispatchProps & IStateProps & libraryProps;

interface IOtpState {
  error: boolean;
  emailOtp?: string;
  phoneOrEmailOtp?: string;
}

export class Otp extends React.PureComponent<IProps, IOtpState> {
  public state = {
    error: false,
    emailOtp: '',
    phoneOrEmailOtp: '',
  };

  public componentDidMount = async (): Promise<void> => {
    const {
      route: {
        params: { updateProfileCallback },
      },
    } = this.props;

    if (!updateProfileCallback) {
      await this.fetchOtp();
    }
  };

  public render = (): React.ReactNode => {
    const {
      t,
      isLoading,
      navigation: { goBack },
      route: { params },
    } = this.props;
    const title = params?.title ?? t('verifyNumber');
    const otpSentTo = params?.otpSentTo ?? '';
    const countryCode = params?.countryCode ?? '';

    return (
      <SafeAreaView style={styles.screen}>
        <DetailedHeader icon={icons.leftArrow} onIconPress={goBack} headerContainerStyle={styles.headerStyle} />
        <View style={styles.container}>
          <Text type="large" textType="semiBold">
            {title}
          </Text>
          <Label style={styles.subTitle} type="large" textType="regular">
            {t('enterOTP')}
          </Label>
          {this.renderOtpInputSection(`${countryCode} ${otpSentTo}`, OtpTypes.PhoneOrEmail)}
          {params.type === OtpNavTypes.UpdateProfileByEmailPhoneOtp
            ? this.renderOtpInputSection(params?.email || '', OtpTypes.Email)
            : null}
        </View>
        <Loader visible={isLoading} />
      </SafeAreaView>
    );
  };

  private renderOtpInputSection = (otpSentTo: string, otpType?: OtpTypes): ReactElement => {
    const {
      t,
      route: {
        params: { type },
      },
    } = this.props;
    const { error } = this.state;

    const toggleError = (): void => {
      this.toggleErrorState(false);
    };

    return (
      <>
        <View style={styles.numberContainer}>
          <Text type="small" textType="semiBold">
            {otpSentTo}
          </Text>
          <Icon
            name={icons.noteBook}
            size={16}
            color={theme.colors.active}
            style={styles.icon}
            onPress={this.onIconPress}
            testID="icnEdit"
          />
        </View>
        <OtpInputs
          error={type !== OtpNavTypes.UpdateProfileByEmailPhoneOtp && error ? t('otpError') : undefined}
          bubbleOtp={this.handleOtpVerification}
          toggleError={toggleError}
          otpType={otpType}
        />
        <OtpTimer onResentPress={this.fetchOtp} />
      </>
    );
  };

  private onIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private onVerifySuccess = async (otp?: string): Promise<void> => {
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
        this.loginOtp(otp ?? '');
        break;
      default:
        break;
    }
  };

  private fetchOtp = async (): Promise<void> => {
    const {
      route: {
        params: { otpSentTo, countryCode },
      },
    } = this.props;

    try {
      if (StringUtils.isValidEmail(otpSentTo)) {
        await UserService.fetchEmailOtp(otpSentTo);
        return;
      }

      await UserService.fetchOtp(otpSentTo, countryCode);
    } catch (e) {
      AlertHelper.error({
        message: e.message,
      });
    }
  };

  private verifyOtp = async (otp: string): Promise<void> => {
    const {
      route: {
        params: { otpSentTo, countryCode, type },
      },
    } = this.props;

    if (type === OtpNavTypes.SocialMedia) {
      await this.socialSignUp(otp);
      return;
    }

    try {
      await UserService.verifyOtp(otp, otpSentTo, countryCode);
      await this.onVerifySuccess(otp);
    } catch (e) {
      this.toggleErrorState(true);
    }
  };

  private signUp = async (): Promise<void> => {
    const {
      login,
      route: {
        params: { userData, onCallback },
      },
    } = this.props;

    if (!userData) {
      return;
    }

    try {
      await UserRepository.signUp(userData);
      const loginData: IEmailLoginPayload = {
        action: LoginTypes.EMAIL,
        payload: {
          email: userData.email,
          password: userData.password,
        },
      };
      const loginPayload: ILoginPayload = {
        data: loginData,
        ...(onCallback && { callback: onCallback }),
      };
      login(loginPayload);
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  private socialSignUp = async (otp: string): Promise<void> => {
    const {
      loginSuccess,
      route: {
        params: { userData },
      },
    } = this.props;

    if (!userData) {
      return;
    }

    try {
      const data: User = await UserRepository.socialSignUp({
        otp,
        user_details: userData,
      });

      const tokens = { refresh_token: data.refreshToken, access_token: data.accessToken };

      loginSuccess(tokens);
      await StorageService.set<IUserTokens>(StorageKeys.USER, tokens);
    } catch (e) {
      console.log(e.details)
      AlertHelper.error({ message: e.message });
    }
  };

  private loginOtp = (otp: string): void => {
    const {
      login,
      route: {
        params: { otpSentTo, countryCode, onCallback },
      },
    } = this.props;

    const loginData: IOtpLoginPayload = {
      action: LoginTypes.OTP,
      payload: {
        phone_code: countryCode,
        phone_number: otpSentTo,
        otp,
      },
    };

    const loginPayload: ILoginPayload = {
      data: loginData,
      callback: onCallback,
    };
    login(loginPayload);
  };

  private toggleErrorState = (error: boolean): void => {
    this.setState({ error });
  };

  private handleOtpVerification = async (otp: string, otpType?: OtpTypes): Promise<void> => {
    const {
      route: {
        params: { updateProfileCallback, type },
      },
    } = this.props;

    if (!updateProfileCallback) {
      await this.verifyOtp(otp);
      return;
    }

    if (type === OtpNavTypes.UpdateProfileByEmailPhoneOtp) {
      this.setState(
        () => (otpType === OtpTypes.PhoneOrEmail ? { phoneOrEmailOtp: otp } : { emailOtp: otp }),
        () => {
          const { emailOtp, phoneOrEmailOtp } = this.state;
          if (emailOtp && phoneOrEmailOtp) {
            updateProfileCallback(phoneOrEmailOtp, emailOtp);
          }
        }
      );
      return;
    }

    updateProfileCallback(otp);
  };
}

export const mapStateToProps = (state: IState): IStateProps => {
  return {
    isLoading: UserSelector.getLoadingState(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { login, loginSuccess } = UserActions;
  return bindActionCreators(
    {
      login,
      loginSuccess,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, WithTranslation, IState>(
  mapStateToProps,
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
    borderBottomWidth: 0,
  },
});
