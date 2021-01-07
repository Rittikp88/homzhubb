import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { ISocialLoginPayload, IVerifyAuthToken, LoginTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { IUserTokens, StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { AuthService } from '@homzhub/mobile/src/services/AuthService';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import Google from '@homzhub/common/src/assets/images/google.svg';
import Email from '@homzhub/common/src/assets/images/email.svg';
import Facebook from '@homzhub/common/src/assets/images/facebook.svg';
import LinkedIn from '@homzhub/common/src/assets/images/linkedin.svg';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { SocialAuthProvider } from '@homzhub/common/src/domain/models/SocialAuthProvider';
import { SocialAuthKeys, ISocialUserData } from '@homzhub/common/src/constants/SocialAuthProviders';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IDispatchProps {
  loginSuccess: (data: IUserTokens) => void;
}

interface IAuthenticationGatewayProps {
  isFromLogin: boolean;
  onEmailLogin?: () => void;
  testID?: string;
  navigation: StackNavigationProp<AuthStackParamList, ScreensKeys.SignUp | ScreensKeys.Login>;
  toggleLoading?: (isLoading: boolean) => void;
}
type Props = IAuthenticationGatewayProps & WithTranslation & IDispatchProps;

interface IOwnState {
  authProviders: SocialAuthProvider[];
}

class AuthenticationGateways extends React.PureComponent<Props, IOwnState> {
  public state = {
    authProviders: [],
  };

  public componentDidMount(): void {
    this.fetchSocialMedia();
  }

  public render(): React.ReactNode {
    const { t, onEmailLogin, isFromLogin } = this.props;
    const titlePrefix = isFromLogin ? t('auth:socialButtonPrefixLogin') : t('auth:socialButtonPrefixSignUp');

    return (
      <View style={styles.buttonContainer}>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
          <Label style={styles.labelText} type="large" textType="regular">
            or {titlePrefix}
          </Label>
          <View style={styles.line} />
        </View>
        <View style={styles.iconContainer}>
          {onEmailLogin && (
            <TouchableOpacity style={styles.alignToCenter} onPress={onEmailLogin}>
              <Email height={24} width={24} />
              <Label type="regular" textType="regular" style={styles.iconTextStyle}>
                {t('emailText')}
              </Label>
            </TouchableOpacity>
          )}
          {this.renderSocialAuths()}
        </View>
      </View>
    );
  }

  private renderSocialAuths = (): React.ReactNode => {
    const { authProviders } = this.state;

    return authProviders.map((auth: SocialAuthProvider) => {
      const initiateSocialLogin = async (): Promise<void> => {
        await this.initiateSocialAuthentication(auth.provider);
      };

      return (
        <>
          {auth.visible && (
            <TouchableOpacity style={styles.alignToCenter} onPress={initiateSocialLogin} key={auth.provider}>
              {this.getImageUrlForLib(auth.provider)}
              <Label type="regular" textType="regular" style={styles.iconTextStyle}>
                {auth.description}
              </Label>
            </TouchableOpacity>
          )}
        </>
      );
    });
  };

  private onSocialAuthSuccess = async (userData: ISocialUserData): Promise<void> => {
    const { loginSuccess, navigation, isFromLogin } = this.props;
    const { idToken, provider } = userData;

    const authPayload: IVerifyAuthToken = {
      provider,
      id_token: idToken,
    };

    try {
      const { is_new_user } = await UserRepository.verifyAuthToken(authPayload);
      if (is_new_user) {
        navigation.navigate(ScreensKeys.MobileVerification, {
          isFromLogin,
          userData,
        });
        return;
      }
      const socialLoginPayload: ISocialLoginPayload = {
        action: LoginTypes.SOCIAL_MEDIA,
        payload: {
          provider,
          id_token: idToken,
        },
      };
      const { refreshToken, accessToken } = await UserRepository.login(socialLoginPayload);

      const tokens = { refresh_token: refreshToken, access_token: accessToken };
      loginSuccess(tokens);
      await StorageService.set<IUserTokens>(StorageKeys.USER, tokens);
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  private initiateSocialAuthentication = async (key: string): Promise<void> => {
    const { isFromLogin, navigation } = this.props;
    this.setLoading(true);
    if (key === SocialAuthKeys.Google) {
      await AuthService.signInWithGoogle(this.onSocialAuthSuccess);
      this.setLoading(false);
      return;
    }

    if (key === SocialAuthKeys.Facebook) {
      await AuthService.signInWithFacebook(this.onSocialAuthSuccess, isFromLogin && navigation);
      this.setLoading(false);
    }
  };

  private setLoading = (isLoading: boolean): void => {
    const { toggleLoading } = this.props;
    if (toggleLoading) {
      toggleLoading(isLoading);
    }
  };

  private fetchSocialMedia = (): void => {
    try {
      const response = CommonRepository.getSocialMedia();
      this.setState({ authProviders: response });
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  private getImageUrlForLib = (key: string): React.ReactNode => {
    switch (key) {
      case SocialAuthKeys.Facebook:
        return <Facebook />;
      case SocialAuthKeys.Google:
        return <Google />;
      case SocialAuthKeys.LinkedIn:
        return <LinkedIn />;
      default:
        return null;
    }
  };
}

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { loginSuccess } = UserActions;
  return bindActionCreators(
    {
      loginSuccess,
    },
    dispatch
  );
};

const HOC = connect(
  null,
  mapDispatchToProps
)(withTranslation(LocaleConstants.namespacesKey.auth)(AuthenticationGateways));
export { HOC as AuthenticationGateways };

const styles = StyleSheet.create({
  buttonContainer: {
    padding: theme.layout.screenPadding,
  },
  lineContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 24,
  },
  line: {
    backgroundColor: theme.colors.darkTint9,
    height: 1,
    flex: 1,
    alignSelf: 'center',
  },
  labelText: {
    alignSelf: 'center',
    paddingHorizontal: 5,
    color: theme.colors.darkTint5,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconTextStyle: {
    marginTop: 4,
  },
  alignToCenter: {
    alignItems: 'center',
  },
});
