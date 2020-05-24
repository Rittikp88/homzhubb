import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { AccessToken, GraphRequest, GraphRequestManager, LoginManager, LoginResult } from 'react-native-fbsdk';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label } from '@homzhub/common/src/components/atoms/Text';

export enum SocialMediaKeys {
  Google = 'GOOGLE',
  Facebook = 'FACEBOOK',
  LinkedIn = 'LINKEDIN',
}

interface ISocialMediaProps {
  socialMediaItems: Array<any>;
  onSuccess: (response: any) => void;
  isFromLogin?: boolean;
  onEmailLogin?: () => void;
}

interface IFacebookResultProps {
  first_name: string;
  last_name: string;
  email: string;
}

export class SocialMediaComponent extends React.PureComponent<ISocialMediaProps, {}> {
  public render(): React.ReactNode {
    const { socialMediaItems, onEmailLogin, isFromLogin } = this.props;
    const titlePrefix = isFromLogin ? 'Log in ' : 'Signup ';
    const buttons: any = [];
    if (!socialMediaItems) {
      return null;
    }
    socialMediaItems.forEach((socialMedia) => {
      const invokeSocialMediaLogin = async (): Promise<void> => {
        if (socialMedia.provider === SocialMediaKeys.Google) {
          await this.onGoogleSignIn(socialMedia.clientID);
        } else {
          this.onFacebookLogin();
        }
      };
      buttons.push(
        <Button
          title={`${titlePrefix}${socialMedia.description}`}
          type="secondary"
          onPress={invokeSocialMediaLogin}
          containerStyle={styles.socialMedia}
          textType="label"
          textSize="large"
          icon="inbox-outline"
          iconColor={theme.colors.darkTint5}
          iconSize={17}
          iconStyle={styles.iconStyle}
          titleStyle={styles.buttonText}
          key={socialMedia.provider}
        />
      );
    });
    return (
      <View style={styles.buttonContainer}>
        <View style={styles.seperatorContainer}>
          <View style={styles.seperatorLine} />
          <Label style={styles.seperatorText} type="large" textType="regular">
            or
          </Label>
          <View style={styles.seperatorLine} />
        </View>
        {onEmailLogin && (
          <Button
            title="Log in with Email"
            type="secondary"
            onPress={onEmailLogin}
            containerStyle={styles.socialMedia}
            textType="label"
            textSize="large"
            icon="inbox-outline"
            iconColor={theme.colors.darkTint5}
            iconSize={17}
            iconStyle={styles.iconStyle}
            titleStyle={styles.buttonText}
          />
        )}
        {buttons}
      </View>
    );
  }

  private onGoogleSignIn = async (clientID: string): Promise<void> => {
    const { onSuccess } = this.props;
    try {
      GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/userinfo.profile'],
        webClientId: clientID,
        iosClientId: clientID,
      });
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const responseObject = {
        ...response,
        provider: 'GOOGLE',
      };
      onSuccess(responseObject);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        AlertHelper.error({ message: 'Sign in Cancelled' });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        AlertHelper.error({ message: 'Sign in is in progress' });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        AlertHelper.error({ message: 'Google Play Services not availabel' });
      } else {
        AlertHelper.error(error);
      }
    }
  };

  private onFacebookLogin = (): void => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      (result: LoginResult) => {
        if (result.isCancelled) {
          AlertHelper.error(result.error);
        } else {
          AccessToken.getCurrentAccessToken().then((data: any) => {
            const { accessToken } = data;
            const infoRequest = new GraphRequest(
              `/me?fields=email,first_name,last_name&access_token=${accessToken}`,
              null,
              this.responseFacebookCallback
            );
            // Start the graph request
            new GraphRequestManager().addRequest(infoRequest).start();
          });
        }
      },
      (error) => {
        AlertHelper.error(error);
      }
    );
  };

  public responseFacebookCallback = (error?: object, result?: object): void => {
    const { onSuccess } = this.props;
    if (error) {
      AlertHelper.error({ message: 'Error in Facebook Signin' });
    } else {
      // eslint-disable-next-line @typescript-eslint/camelcase
      const responseObject = {
        provider: 'FACEBOOK',
        user: result,
      };
      onSuccess(responseObject);
    }
  };
}

const styles = StyleSheet.create({
  buttonContainer: {
    padding: theme.layout.screenPadding,
  },
  seperatorContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 24,
  },
  seperatorLine: {
    backgroundColor: theme.colors.darkTint9,
    height: 1,
    flex: 1,
    alignSelf: 'center',
  },
  seperatorText: {
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
  iconStyle: {
    paddingLeft: 10,
  },
});
