import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { images } from '@homzhub/common/src/assets/images';
import { Text, Button, Label } from '@homzhub/common/src/components';

type IProps = NavigationScreenProps<AuthStackParamList, ScreensKeys.SignUp> & WithTranslation;

class GettingStarted extends React.PureComponent<IProps> {
  public render(): React.ReactElement {
    const { t } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={images.gettingStarted} />
        </View>
        <View style={styles.headerContainer}>
          <Text type="large" textType="semiBold">
            {t('header')}
          </Text>
          <Text type="large" textType="semiBold" style={styles.ownerText}>
            {t('owners')}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={t('getStarted')}
            type="primary"
            textSize="small"
            containerStyle={styles.getStarted}
            onPress={this.getStarted}
          />
          <Button title={t('login')} type="secondary" containerStyle={styles.login} onPress={this.login} />
        </View>
        <View style={styles.labelContainer}>
          <Label type="large" textType="regular">
            {t('newAroundHere')} &nbsp;
            <Label type="large" textType="bold" style={styles.signUpLink} onPress={this.navigateToSignUp}>
              {t('signUp')}
            </Label>
          </Label>
        </View>
      </View>
    );
  }

  public getStarted = (): void => {
    // TODO: Navigate to app
  };

  public login = (): void => {
    // TODO: Navigate to login page
  };

  public navigateToSignUp = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.SignUp);
  };
}

const HOC = withTranslation()(GettingStarted);
export { HOC as GettingStarted };

const styles = StyleSheet.create({
  container: {
    ...theme.globalStyles.center,
    backgroundColor: theme.colors.background,
    margin: theme.layout.screenPadding,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  logoContainer: {
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 30,
  },
  headerContainer: {
    marginVertical: 20,
    flex: 0,
    marginHorizontal: 36,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  ownerText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    marginHorizontal: 35,
    justifyContent: 'center',
  },
  getStarted: {
    flex: 0,
    marginVertical: 10,
    backgroundColor: theme.colors.blue,
  },
  login: {
    flex: 0,
    marginVertical: 10,
  },
  labelContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  signUpLink: {
    color: theme.colors.blue,
  },
});
