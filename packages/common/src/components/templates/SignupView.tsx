import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { LoginManager, LoginResult, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { theme } from '@homzhub/common/src/styles/theme';
import { AlertHelper } from '@homzhub/mobile/src/utils/AlertHelper';
import { Button, Text, SignUpForm } from '@homzhub/common/src/components';

export enum SocialMediaKeys {
  Google = 'GOOGLE',
  Facebook = 'FACEBOOK',
  LinkedIn = 'LINKEDIN',
}

interface IProps {
  socialMediaItems: Array<any>;
}

export class SignupView extends React.PureComponent<IProps, {}> {
  public render(): React.ReactElement {
    return (
      <>
        <SignUpForm/>
        {this.renderSocialMedia()}
      </>
    );
  }

  public renderSocialMedia = (): React.ReactNode => {
    const { socialMediaItems } = this.props;
    const buttons: any = [];
    if (!socialMediaItems) {
      return null;
    }
    socialMediaItems.forEach((socialMedia) => {
      buttons.push(
        <Button
          title={socialMedia.description}
          type="secondary"
          onPress={socialMedia.provider === SocialMediaKeys.Google ? this.onGoogleSignIn : this.onFacebookLogin}
          containerStyle={styles.socialMedia}
          textType="label"
          textSize="large"
          titleStyle={styles.buttonText}
          key={socialMedia.provider}
        />,
      );
    });
    return (
      <View style={styles.buttonContainer}>
        <View style={styles.seperatorContainer}>
          <View style={styles.seperatorLine}/>
          <Text style={styles.seperatorText} type="regular" textType="regular">
            or
          </Text>
          <View style={styles.seperatorLine}/>
        </View>
        {buttons}
      </View>
    );
  };

  public onGoogleSignIn = async (socialMedia: any): Promise<void> => {
    try {
      GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/userinfo.profile'],
        webClientId: socialMedia.clientID,
      });
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      // TODO: Add further logic to navigate to next screen
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

  public onFacebookLogin = (): void => {
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
              () => this.responseCallback,
            );
            // Start the graph request
            new GraphRequestManager().addRequest(infoRequest).start();
          });
        }
      },
      (error) => {
        AlertHelper.error(error);
      },
    );
  };

  public responseCallback = (error: object, result: object): void => {
    if (error) {
      AlertHelper.error({ message: 'Error in Facebook Signin' });
    } else {
      // TODO: Navigate the user with the result from here
    }
  };
}

const styles = StyleSheet.create({
  buttonContainer: {
    padding: theme.layout.screenPadding,
  },
  seperatorContainer: {
    flexDirection: 'row',
  },
  seperatorLine: {
    backgroundColor: theme.colors.darkTint5,
    height: 2,
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
  },
  buttonText: {
    fontSize: 14,
    color: theme.colors.darkTint5,
  },
});
