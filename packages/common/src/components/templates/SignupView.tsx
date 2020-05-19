import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button, Text, SignUpForm } from '@homzhub/common/src/components';

interface IProps {
  socialMediaItems: Array<any>;
}

export class SignupView extends React.PureComponent<IProps, {}> {
  public render(): React.ReactElement {
    return (
      <>
        <SignUpForm />
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
          onPress={this.onGoogleSignIn}
          containerStyle={styles.socialMedia}
          textType="label"
          textSize="large"
          titleStyle={styles.buttonText}
          key={socialMedia.provider}
        />
      );
    });
    return (
      <View style={styles.buttonContainer}>
        <View style={styles.seperatorContainer}>
          <View style={styles.seperatorLine} />
          <Text style={styles.seperatorText} type="regular" textType="regular">
            or
          </Text>
          <View style={styles.seperatorLine} />
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
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
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
