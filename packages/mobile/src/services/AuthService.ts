import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ConfigHelper } from '@homzhub/common/src/utils/ConfigHelper';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';
import { ISocialUserData, SocialAuthKeys } from '@homzhub/common/src/constants/SocialAuthProviders';

class AuthService {
  // eslint-disable-next-line consistent-return
  public signInWithGoogle = async (successCallback: (result: ISocialUserData) => Promise<void>): Promise<void> => {
    try {
      GoogleSignin.configure({
        webClientId: ConfigHelper.getGoogleWebClientId(),
        iosClientId: ConfigHelper.getGoogleIosClientId(),
      });

      await GoogleSignin.hasPlayServices();
      GoogleSignin.signOut();

      const {
        user: { givenName, familyName, email },
        idToken,
      } = await GoogleSignin.signIn();

      if (!idToken) {
        throw new Error(I18nService.t('common:somethingWentWrongText'));
      }

      successCallback({
        provider: SocialAuthKeys.Google,
        idToken,
        user: {
          email,
          first_name: givenName || '',
          last_name: familyName || '',
        },
      });
    } catch (error) {
      let alertMessage: string;

      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          alertMessage = I18nService.t('auth:userCancelledLoginProcess');
          break;
        case statusCodes.IN_PROGRESS:
          alertMessage = I18nService.t('auth:signInUnderProgress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          alertMessage = I18nService.t('auth:googlePlayServicesNotAvailable');
          break;
        default:
          alertMessage = error.message;
      }
      AlertHelper.error({ message: alertMessage });
    }
  };

  // eslint-disable-next-line consistent-return
  public signInWithFacebook = async (
    successCallback: (result: ISocialUserData) => Promise<void>,
    navigation?: any
  ): Promise<void> => {
    try {
      if (PlatformUtils.isAndroid()) {
        LoginManager.setLoginBehavior('native_with_fallback');
      }
      LoginManager.logOut();
      // Attempt login with permissions

      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) {
        throw new Error(I18nService.t('auth:userCancelledLoginProcess'));
      }

      const accessToken: AccessToken | null = await AccessToken.getCurrentAccessToken();

      if (!accessToken) {
        throw new Error(I18nService.t('auth:errorInFacebookSignIn'));
      }

      const infoRequest = new GraphRequest(
        `/me?fields=email,first_name,last_name&access_token=${accessToken.accessToken}`,
        null,
        (error?: object, response?: object) => {
          if (error || !response) {
            throw new Error(I18nService.t('auth:errorInFacebookSignIn'));
            return;
          }
          // @ts-ignore
          if (!response.email) {
            if (navigation) {
              navigation.navigate(ScreensKeys.AuthStack, {
                screen: ScreensKeys.SignUp,
              });
            }
            AlertHelper.error({ message: I18nService.t('auth:fbEmailLinkingError') });
            return;
          }
          successCallback(this.getFbUserData(response, accessToken.accessToken));
        }
      );
      new GraphRequestManager().addRequest(infoRequest).start();
    } catch (error) {
      AlertHelper.error({ message: error.message });
    }
  };

  public getFbUserData = (result: any, token: string): ISocialUserData => {
    return {
      provider: SocialAuthKeys.Facebook,
      user: {
        first_name: result.first_name,
        last_name: result.last_name,
        email: result.email,
      },
      idToken: token ?? '',
    };
  };
}

const authService = new AuthService();
export { authService as AuthService };
