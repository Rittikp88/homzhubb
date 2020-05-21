import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Header } from '@homzhub/common/src/components/molecules/Header';
import { LoginForm } from '@homzhub/common/src/components/organisms/LoginForm';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

type Props = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.EmailLogin>;

class EmailLoginScreen extends React.PureComponent<Props, {}> {
  public render(): React.ReactNode {
    const { t } = this.props;
    return (
      <View style={styles.container}>
        <Header
          icon="left-arrow"
          subTitle={t('auth:logInWithEmail')}
          subTitleType="large"
          subTitleColor={theme.colors.dark}
          onIconPress={this.handleIconPress}
        />
        <LoginForm isEmailLogin />
      </View>
    );
  }

  private handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };
}

const HOC = withTranslation()(EmailLoginScreen);
export { HOC as EmailLoginScreen };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});
