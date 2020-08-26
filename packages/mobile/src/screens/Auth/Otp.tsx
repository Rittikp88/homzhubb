import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { StorageService } from '@homzhub/common/src/services/storage/StorageService';
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
import { DetailedHeader, Label, OtpTimer, Text } from '@homzhub/common/src/components';
import { Loader, OtpInputs } from '@homzhub/mobile/src/components';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, OtpNavTypes, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { User, IUser } from '@homzhub/common/src/domain/models/User';

interface IStateProps {
  isLoading: boolean;
}

interface IDispatchProps {
  login: (payload: ILoginPayload) => void;
  loginSuccess: (data: IUser) => void;
}

type libraryProps = NavigationScreenProps<AuthStackParamList, ScreensKeys.OTP> & WithTranslation;
type IProps = IDispatchProps & IStateProps & libraryProps;

interface IOtpState {
  error: boolean;
}

export class Otp extends React.PureComponent<IProps, IOtpState> {
  public state = {
    error: false,
  };

  public componentDidMount = async (): Promise<void> => {
    await this.fetchOtp();
  };

  public render = (): React.ReactNode => {
    const {
      t,
      isLoading,
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
        <DetailedHeader icon={icons.leftArrow} onIconPress={goBack} headerContainerStyle={styles.headerStyle} />
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
              name={icons.noteBook}
              size={16}
              color={theme.colors.active}
              style={styles.icon}
              onPress={this.onIconPress}
              testID="icnEdit"
            />
          </View>
          <OtpInputs error={error ? t('otpError') : undefined} bubbleOtp={this.verifyOtp} toggleError={toggleError} />
          <OtpTimer onResentPress={this.fetchOtp} />
        </View>
        <Loader visible={isLoading} />
      </SafeAreaView>
    );
  };

  private onIconPress = (): void => {
    const {
      navigation,
      route: { params },
    } = this.props;

    if (params && params.ref) {
      params.ref()?.focus();
    }

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
        params: { phone, countryCode },
      },
    } = this.props;

    try {
      await UserService.fetchOtp(phone, countryCode);
    } catch (e) {
      AlertHelper.error({
        message: e.message,
      });
    }
  };

  private verifyOtp = async (otp: string): Promise<void> => {
    const {
      route: {
        params: { phone, countryCode, type },
      },
    } = this.props;

    if (type === OtpNavTypes.SocialMedia) {
      await this.socialSignUp(otp);
      return;
    }

    try {
      await UserService.verifyOtp(otp, phone, countryCode);
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
      const serializedUser: IUser = ObjectMapper.serialize(data);
      loginSuccess(serializedUser);
      await StorageService.set<IUser>('@user', serializedUser);
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  private loginOtp = (otp: string): void => {
    const {
      login,
      route: {
        params: { phone, countryCode, onCallback },
      },
    } = this.props;

    const loginData: IOtpLoginPayload = {
      action: LoginTypes.OTP,
      payload: {
        country_code: countryCode,
        phone_number: phone,
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
    paddingTop: 0,
    borderBottomWidth: 0,
  },
});
