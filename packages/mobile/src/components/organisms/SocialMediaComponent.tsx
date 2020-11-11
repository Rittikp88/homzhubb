import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager, LoginResult } from 'react-native-fbsdk';
import { CommonRepository } from '@homzhub/common/src/domain/repositories/CommonRepository';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { IUserTokens, StorageKeys, StorageService } from '@homzhub/common/src/services/storage/StorageService';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import Google from '@homzhub/common/src/assets/images/google.svg';
import Facebook from '@homzhub/common/src/assets/images/facebook.svg';
import LinkedIn from '@homzhub/common/src/assets/images/linkedin.svg';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { SocialMediaKeys, ISocialUserData } from '@homzhub/common/src/assets/constants';
import { LoginTypes, ISocialLoginPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { ISocialMediaProvider } from '@homzhub/common/src/domain/models/SocialMediaProvider';

interface IDispatchProps {
  loginSuccess: (data: IUserTokens) => void;
}

interface ISocialMediaProps {
  isFromLogin: boolean;
  onEmailLogin?: () => void;
  testID?: string;
  navigation: StackNavigationProp<AuthStackParamList, ScreensKeys.SignUp | ScreensKeys.Login>;
}
type Props = ISocialMediaProps & WithTranslation & IDispatchProps;

interface IOwnState {
  socialMediaItems: ISocialMediaProvider[];
}

class SocialMediaComponent extends React.PureComponent<Props, IOwnState> {
  public state = {
    socialMediaItems: [],
  };

  public async componentDidMount(): Promise<void> {
    await this.fetchSocialMedia();
  }

  public render(): React.ReactNode {
    const { onEmailLogin, testID } = this.props;
    return (
      <View style={styles.buttonContainer}>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
          <Label style={styles.labelText} type="large" textType="regular">
            or
          </Label>
          <View style={styles.line} />
        </View>
        {onEmailLogin && (
          <Button
            title="Log in with Email"
            type="secondary"
            onPress={onEmailLogin}
            containerStyle={styles.socialMedia}
            textType="label"
            textSize="large"
            icon={icons.inboxOutline}
            iconColor={theme.colors.darkTint5}
            iconSize={20}
            titleStyle={styles.buttonText}
            testID={testID}
          />
        )}
        {this.renderButtons()}
      </View>
    );
  }

  private renderButtons = (): React.ReactNode => {
    const { isFromLogin, t } = this.props;
    const { socialMediaItems } = this.state;
    const titlePrefix = isFromLogin ? t('auth:socialButtonPrefixLogin') : t('auth:socialButtonPrefixSignUp');

    return socialMediaItems.map((socialMedia: ISocialMediaProvider) => {
      const initiateSocialLogin = async (): Promise<void> => {
        await this.initiateSocialLogin(socialMedia);
      };

      return (
        <Button
          title={`${titlePrefix}${socialMedia.description}`}
          type="secondary"
          onPress={initiateSocialLogin}
          containerStyle={styles.socialMedia}
          textType="label"
          textSize="large"
          node={this.getImageUrlForLib(socialMedia)}
          titleStyle={styles.buttonText}
          key={socialMedia.provider}
        />
      );
    });
  };

  private onSocialMediaLoginSuccess = async (userData: ISocialUserData): Promise<void> => {
    const { loginSuccess, navigation, isFromLogin } = this.props;
    const { provider, idToken } = userData;

    const socialLoginData: ISocialLoginPayload = {
      action: LoginTypes.SOCIAL_MEDIA,
      payload: {
        provider,
        id_token: idToken ?? '',
      },
    };

    try {
      const response = await UserRepository.socialLogin(socialLoginData);
      if ((response as { is_new_user: boolean }).is_new_user) {
        navigation.navigate(ScreensKeys.MobileVerification, {
          isFromLogin,
          userData,
        });
        return;
      }

      // @ts-ignore
      const tokens = { refresh_token: response.refreshToken, access_token: response.accessToken };

      loginSuccess(tokens);
      await StorageService.set<IUserTokens>(StorageKeys.USER, tokens);
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  private initiateSocialLogin = async (socialMedia: any): Promise<void> => {
    if (socialMedia.provider === SocialMediaKeys.Google) {
      await this.googleSignIn(socialMedia.client_id);
      return;
    }
    await this.facebookLogin();
  };

  private googleSignIn = async (clientID: string): Promise<void> => {
    try {
      GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/userinfo.profile'],
        webClientId: clientID,
        iosClientId: clientID,
      });

      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const {
        user: { givenName, email, familyName },
      } = response;

      const responseObject = {
        provider: SocialMediaKeys.Google,
        idToken: response.idToken,
        user: {
          first_name: givenName ?? '',
          last_name: familyName ?? '',
          email,
        },
      };

      // @ts-ignore
      await this.onSocialMediaLoginSuccess(responseObject);
    } catch (error) {
      let alertMessage = '';
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          alertMessage = 'Sign in Cancelled';
          break;
        case statusCodes.IN_PROGRESS:
          alertMessage = 'Sign in is in progress';
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          alertMessage = 'Google Play Services not available';
          break;
        default:
          alertMessage = error.message;
      }
      AlertHelper.error({ message: alertMessage });
    }
  };

  private facebookLogin = async (): Promise<void> => {
    try {
      const loginResult: LoginResult = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (loginResult.isCancelled) {
        AlertHelper.error({ message: 'Sign in Cancelled' });
        return;
      }

      const accessTokenData: AccessToken | null = await AccessToken.getCurrentAccessToken();
      const infoRequest = new GraphRequest(
        `/me?fields=email,first_name,last_name&access_token=${accessTokenData?.accessToken}`,
        null,
        (error?: object, result?: object) => {
          this.responseFacebookCallback(error, result, accessTokenData?.accessToken);
        }
      );

      new GraphRequestManager().addRequest(infoRequest).start();
    } catch (error) {
      AlertHelper.error({ message: error.message });
    }
  };

  public responseFacebookCallback = async (error?: object, result?: any, token?: string): Promise<void> => {
    if (error || !result) {
      AlertHelper.error({ message: 'Error in Facebook Signin' });
      return;
    }
    const responseObject = {
      provider: SocialMediaKeys.Facebook,
      user: {
        first_name: result.first_name,
        last_name: result.last_name,
        email: result.email,
      },
      idToken: token ?? '',
    };
    await this.onSocialMediaLoginSuccess(responseObject);
  };

  private fetchSocialMedia = async (): Promise<void> => {
    try {
      const response = await CommonRepository.getSocialMedia();
      this.setState({ socialMediaItems: response });
    } catch (e) {
      AlertHelper.error({ message: e.message });
    }
  };

  private getImageUrlForLib = (socialMedia: any): React.ReactElement => {
    switch (socialMedia.provider) {
      case SocialMediaKeys.Facebook:
        return <Facebook />;
      case SocialMediaKeys.Google:
        return <Google />;
      default:
        return <LinkedIn />;
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
)(withTranslation(LocaleConstants.namespacesKey.auth)(SocialMediaComponent));
export { HOC as SocialMediaComponent };

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
  socialMedia: {
    borderColor: theme.colors.darkTint5,
    marginVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row-reverse',
  },
  buttonText: {
    flex: 1,
    color: theme.colors.darkTint5,
  },
});
