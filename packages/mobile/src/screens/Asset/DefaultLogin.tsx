import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { CommonActions } from '@react-navigation/native';
import { theme } from '@homzhub/common/src/styles/theme';
import Logo from '@homzhub/common/src/assets/images/homzhubLogo.svg';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { BottomTabNavigatorParamList } from '@homzhub/mobile/src/navigation/BottomTabs';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src/components/atoms/Text';

type libraryProps = WithTranslation & NavigationScreenProps<BottomTabNavigatorParamList, ScreensKeys.DefaultLogin>;
type IProps = libraryProps;

export class DefaultLogin extends React.PureComponent<IProps> {
  public render(): React.ReactElement {
    const { t } = this.props;
    return (
      <View style={styles.container}>
        <Logo height={100} width={100} />
        <Text type="small" textType="regular" style={styles.loginText}>
          {t('pleaseSignup')}
        </Text>
        <Button type="primary" title={t('signUp')} containerStyle={styles.button} onPress={this.navigateToSignup} />
      </View>
    );
  }

  public navigateToSignup = (): void => {
    const { navigation } = this.props;
    navigation.dispatch(
      CommonActions.navigate({
        name: ScreensKeys.AuthStack,
      })
    );
  };
}

export default withTranslation()(DefaultLogin);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  loginText: {
    marginVertical: 10,
  },
  button: {
    flex: 0,
    marginVertical: 10,
  },
});
