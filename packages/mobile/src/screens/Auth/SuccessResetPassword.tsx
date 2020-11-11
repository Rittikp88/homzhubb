import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { DetailedHeader } from '@homzhub/common/src/components/molecules/DetailedHeader';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';

export type Props = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.ResetPassword>;

export class SuccessResetPassword extends Component<Props, {}> {
  public render(): React.ReactNode {
    const { t } = this.props;
    return (
      <View style={styles.container}>
        <DetailedHeader
          icon={icons.close}
          title={t('auth:successResetPassword')}
          subTitle={t('auth:successResetPasswordDescription')}
          onIconPress={this.navigateToLogin}
          headerContainerStyle={styles.headerContainer}
        />
        <Button
          type="primary"
          title={t('common:login')}
          onPress={this.navigateToLogin}
          containerStyle={styles.button}
          testID="btnLogin"
        />
      </View>
    );
  }

  public navigateToLogin = (): void => {
    const {
      navigation,
      route: { params },
    } = this.props;
    const onCallback = params && params.onCallback ? { onCallback: params.onCallback } : {};
    navigation.navigate(ScreensKeys.Login, onCallback);
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
