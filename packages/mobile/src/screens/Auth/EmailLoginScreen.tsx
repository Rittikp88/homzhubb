import React from 'react';
import { StyleSheet } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { LoginForm } from '@homzhub/common/src/components/organisms/LoginForm';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { AuthStackParamList } from '@homzhub/mobile/src/navigation/AuthStack';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { NavigationScreenProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import {
  IEmailLoginPayload,
  ILoginFormData,
  ILoginPayload,
  LoginTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';

interface IStateProps {
  isLoading: boolean;
}

interface IDispatchProps {
  login: (payload: ILoginPayload) => void;
}

type libraryProps = WithTranslation & NavigationScreenProps<AuthStackParamList, ScreensKeys.EmailLogin>;
type Props = IDispatchProps & IStateProps & libraryProps;

export class EmailLoginScreen extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { t, isLoading } = this.props;
    return (
      <Screen
        containerStyle={styles.container}
        headerProps={{
          type: 'secondary',
          icon: icons.leftArrow,
          onIconPress: this.handleIconPress,
        }}
        pageHeaderProps={{
          contentTitle: t('auth:logInWithEmail'),
        }}
        backgroundColor={theme.colors.white}
        isLoading={isLoading}
      >
        <LoginForm
          isEmailLogin
          handleForgotPassword={this.handleForgotPassword}
          onLoginSuccess={this.handleLoginSuccess}
          testID="loginForm"
        />
      </Screen>
    );
  }

  private handleIconPress = (): void => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  private handleForgotPassword = (): void => {
    const {
      navigation,
      route: { params },
    } = this.props;
    const onCallback = params && params.onCallback ? { onCallback: params.onCallback } : {};
    navigation.navigate(ScreensKeys.ForgotPassword, onCallback);
  };

  private handleLoginSuccess = (values: ILoginFormData): void => {
    const {
      login,
      route: { params },
    } = this.props;

    const emailLoginData: IEmailLoginPayload = {
      action: LoginTypes.EMAIL,
      payload: {
        email: values.email,
        password: values.password,
      },
    };

    const loginPayload: ILoginPayload = {
      data: emailLoginData,
      ...(params && params.onCallback && { callback: params.onCallback }),
    };

    login(loginPayload);
  };
}

export const mapStateToProps = (state: IState): IStateProps => {
  return {
    isLoading: UserSelector.getLoadingState(state),
  };
};

export const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const { login } = UserActions;
  return bindActionCreators(
    {
      login,
    },
    dispatch
  );
};

export default connect<IStateProps, IDispatchProps, WithTranslation, IState>(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(EmailLoginScreen));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
});
