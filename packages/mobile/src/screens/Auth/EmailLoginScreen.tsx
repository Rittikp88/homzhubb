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
  IOtpLoginPayload,
  LoginTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { DetailedHeader } from '@homzhub/common/src/components/molecules/DetailedHeader';
import { LoginForm } from '@homzhub/common/src/components/organisms/LoginForm';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IDispatchProps {
  login: (payload: IEmailLoginPayload | IOtpLoginPayload) => void;
}

type libraryProps = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.EmailLogin>;
type Props = IDispatchProps & libraryProps;

export class EmailLoginScreen extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { t } = this.props;
    return (
      <View style={styles.container}>
        <DetailedHeader
          icon={icons.leftArrow}
          subTitle={t('auth:logInWithEmail')}
          subTitleType="large"
          subTitleColor={theme.colors.dark}
          onIconPress={this.handleIconPress}
          testID="headerIconPress"
        />
        <LoginForm
          isEmailLogin
          handleForgotPassword={this.handleForgotPassword}
          onLoginSuccess={this.handleLoginSuccess}
          testID="loginForm"
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
      action: LoginTypes.EMAIL,
      payload: {
        email: values.email,
        password: values.password,
      },
    };

    login(emailLoginData);
  };
}

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
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
