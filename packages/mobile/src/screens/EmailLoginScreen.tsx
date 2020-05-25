import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import {
  IEmailLoginPayload,
  ILoginFormData,
  IMobileLoginPayload,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { Header } from '@homzhub/common/src/components/molecules/Header';
import { LoginForm } from '@homzhub/common/src/components/organisms/LoginForm';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IDispatchProps {
  login: (payload: IEmailLoginPayload | IMobileLoginPayload) => void;
}

type libraryProps = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.EmailLogin>;
type Props = IDispatchProps & libraryProps;

class EmailLoginScreen extends React.PureComponent<Props> {
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
        <LoginForm
          isEmailLogin
          handleForgotPassword={this.handleForgotPassword}
          onLoginSuccess={this.handleLoginSuccess}
        />
      </View>
    );
  }

  private handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private handleForgotPassword = (): void => {
    const { navigation } = this.props;
    navigation.navigate(ScreensKeys.ForgotPassword);
  };

  private handleLoginSuccess = (values: ILoginFormData): void => {
    const { login } = this.props;

    const emailLoginData: IEmailLoginPayload = {
      action: 'EMAIL_LOGIN',
      payload: {
        email: values.email,
        password: values.password,
      },
    };

    login(emailLoginData);
  };
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { login } = UserActions;
  return bindActionCreators(
    {
      login,
    },
    dispatch
  );
};

export default connect<null, IDispatchProps, WithTranslation, IState>(
  null,
  mapDispatchToProps
)(withTranslation()(EmailLoginScreen));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});
