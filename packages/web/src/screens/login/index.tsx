import React, { FC } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Formik, FormikProps } from 'formik';
import { History } from 'history';
import { useDown, useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { LoginForm } from '@homzhub/common/src/components/organisms/LoginForm';
import UserValidationScreensTemplate from '@homzhub/web/src/components/hoc/UserValidationScreensTemplate';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IEmailLoginPayload, ILoginPayload, LoginTypes } from '@homzhub/common/src/domain/repositories/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { StoreProviderService } from '@homzhub/common/src/services/StoreProviderService';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IFormData {
  email: string;
  password: string;
}

interface IStateProps {
  isLoading: boolean;
}

interface IDispatchProps {
  login: (payload: ILoginPayload) => void;
}

interface IOwnProps {
  history: History;
}

type IProps = IStateProps & IDispatchProps & IOwnProps;

const Login: FC<IProps> = (props: IProps) => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);
  const styles = formStyles(isMobile, isDesktop);
  const { t } = useTranslation(LocaleConstants.namespacesKey.common);

  const formData = {
    email: '',
    password: '',
  };
  const navigateToHomeScreen = (): void => {
    NavigationUtils.navigate(props.history, { path: RouteNames.protectedRoutes.DASHBOARD });
  };

  const handleSubmitEmailLogin = (values: IFormData): void => {
    // TODO: remove .logoutUser after logout functionality is implemented
    StoreProviderService.logoutUser();

    const emailLoginData: IEmailLoginPayload = {
      action: LoginTypes.EMAIL,
      payload: {
        email: values.email,
        password: values.password,
      },
    };

    const loginPayload: ILoginPayload = {
      data: emailLoginData,
      callback: navigateToHomeScreen,
    };
    props.login(loginPayload);
  };

  const handleForgotPassword = (): void => {
    // TODO: Add redirection logic for password reset.
  };

  return (
    <UserValidationScreensTemplate
      title={t('login')}
      subTitle={t('auth:loginToAccessHomzhub')}
      containerStyle={styles.container}
      hasBackButton
    >
      <View style={styles.loginForm}>
        <Formik initialValues={formData} onSubmit={handleSubmitEmailLogin}>
          {(formProps: FormikProps<IFormData>): React.ReactElement => (
            <View>
              <LoginForm
                isEmailLogin
                onLoginSuccess={handleSubmitEmailLogin}
                handleForgotPassword={handleForgotPassword}
                testID="loginFormWeb"
              />
            </View>
          )}
        </Formik>
      </View>
    </UserValidationScreensTemplate>
  );
};

interface IFormStyles {
  container: ViewStyle;
  loginForm: ViewStyle;
  logo: ViewStyle;
  backButton: ViewStyle;
}

const formStyles = (isMobile: boolean, isDesktop: boolean): StyleSheet.NamedStyles<IFormStyles> =>
  StyleSheet.create<IFormStyles>({
    container: {
      flex: 1,
      width: isDesktop ? '45%' : '100%',
    },
    loginForm: {
      width: isMobile ? '90%' : '55%',
      marginHorizontal: 'auto',
    },
    logo: {
      width: '100%',
      left: 0,
    },
    backButton: {
      left: 0,
      marginBottom: 25,
      marginTop: 50,
      borderWidth: 0,
      width: 'fit-content',
    },
  });

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

export default connect<IStateProps, IDispatchProps, {}, IState>(mapStateToProps, mapDispatchToProps)(Login);
