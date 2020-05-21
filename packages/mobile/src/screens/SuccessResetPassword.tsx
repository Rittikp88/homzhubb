import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Header, Button } from '@homzhub/common/src/components';
import { theme } from '@homzhub/common/src/styles/theme';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';

type Props = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.ResetPassword>;

class SuccessResetPassword extends Component<Props, {}> {
  public render(): React.ReactNode {
    const { t } = this.props;
    return (
      <View style={styles.container}>
        <Header
          icon="close"
          title={t('auth:successResetPassword')}
          subTitle={t('auth:successResetPasswordDescription')}
          onIconPress={this.handleIconPress}
          headerContainerStyle={styles.headerContainer}
        />
        <Button
          type="primary"
          title={t('common:login')}
          onPress={this.navigateToLogin}
          containerStyle={styles.button}
        />
      </View>
    );
  }

  public handleIconPress = (): void => {
    const { navigation } = this.props;
    // TODO: Redirect to Login Page once ready
    navigation.navigate(ScreensKeys.ResetPassword);
  };

  public navigateToLogin = (): void => {
    const { navigation } = this.props;
    // TODO: Redirect to Login Page once ready
    navigation.navigate(ScreensKeys.ResetPassword);
  };
}

export default withTranslation()(SuccessResetPassword);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  headerContainer: {
    borderBottomWidth: 0,
  },
  button: {
    flex: 0,
    margin: theme.layout.screenPadding,
  },
});
