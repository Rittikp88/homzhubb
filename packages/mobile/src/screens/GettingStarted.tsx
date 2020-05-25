import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { images } from '@homzhub/common/src/assets/images';
import { Text, Button, Label, Image } from '@homzhub/common/src/components';

type IProps = NavigationScreenProps<AuthStackParamList, ScreensKeys.SignUp> & WithTranslation;

class GettingStarted extends React.PureComponent<IProps> {
  public render(): React.ReactElement {
    const { t } = this.props;
    return (
      <View style={styles.container}>
        <Image source={images.gettingStarted} style={styles.imageAndText} />
        <Text type="regular" textType="semiBold" style={styles.imageAndText}>
          {t('header')}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title={t('getStarted')}
            type="primary"
            textSize="small"
            containerStyle={styles.getStarted}
            onPress={this.getStarted}
          />
          <Button title={t('login')} type="secondary" containerStyle={styles.login} onPress={this.login} />
          <Label type="large" textType="regular" style={styles.imageAndText}>
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
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.PropertySearch);
  };

  public login = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.Login);
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
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'space-around',
    padding: theme.layout.screenPadding,
  },
  imageAndText: {
    alignSelf: 'center',
  },
  buttonContainer: {
    alignItems: 'stretch',
    marginHorizontal: 20,
  },
  getStarted: {
    flex: 0,
  },
  login: {
    flex: 0,
    marginVertical: 20,
  },
  signUpLink: {
    color: theme.colors.blue,
  },
});
