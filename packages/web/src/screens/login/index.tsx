import React, { FC, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Formik, FormikProps } from 'formik';
import { History } from 'history';
import { useDown, useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { LoginForm } from '@homzhub/common/src/components/organisms/LoginForm';
import UserValidationScreensTemplate from '@homzhub/web/src/components/hoc/UserValidationScreensTemplate';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { SocialMediaGateway } from '@homzhub/web/src/components/organisms/SocialMediaGateway';
import {
  IEmailLoginPayload,
  ILoginFormData,
  ILoginPayload,
  LoginTypes,
} from '@homzhub/common/src/domain/repositories/interfaces';
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
  const [isEmailLogin, setIsEmailLogin] = useState(false); // Requred for conditional rendering

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

  const handleEmailLogin = (): void => {
    setIsEmailLogin(true);
  };

  const backToLoginWithPhone = (): void => {
    setIsEmailLogin(false);
  };

  const handleForgotPassword = (): void => {
    // TODO: Add redirection logic for password reset.
  };
  const handleOtpLogin = (values: ILoginFormData): void => {
    // TODO : Navigation to OTP
  };
  const handleNavigationToSignup = (): void => {
    // TODO : Navigation to signup page
  };
  return (
    <UserValidationScreensTemplate
      title={t('login')}
      subTitle={isEmailLogin ? t('auth:loginToAccessHomzhubEmail') : t('auth:loginToAccessHomzhubPhone')}
      containerStyle={styles.container}
      hasBackButton={isEmailLogin}
      backButtonPressed={backToLoginWithPhone}
    >
      <View style={styles.loginForm}>
        <Formik initialValues={formData} onSubmit={handleSubmitEmailLogin}>
          {(formProps: FormikProps<IFormData>): React.ReactElement => (
            <View>
              <LoginForm
                isEmailLogin={isEmailLogin}
                onLoginSuccess={isEmailLogin ? handleOtpLogin : handleSubmitEmailLogin}
                handleForgotPassword={handleForgotPassword}
                testID="loginFormWeb"
              />
            </View>
          )}
        </Formik>
        <View style={styles.newUser}>
          <Typography variant="label" size="large">
            {t('auth:newOnPlatform')}
          </Typography>
          <Typography
            variant="label"
            size="large"
            fontWeight="semiBold"
            onPress={handleNavigationToSignup}
            style={styles.createAccount}
          >
            {t('auth:createAccout')}
          </Typography>
        </View>
      </View>
      <SocialMediaGateway onEmailLogin={handleEmailLogin} isFromLogin containerStyle={styles.socialMediaContainer} />
    </UserValidationScreensTemplate>
  );
};

interface IFormStyles {
  container: ViewStyle;
  loginForm: ViewStyle;
  logo: ViewStyle;
  backButton: ViewStyle;
  newUser: ViewStyle;
  createAccount: ViewStyle;
  socialMediaContainer: ViewStyle;
}

const formStyles = (isMobile: boolean, isDesktop: boolean): StyleSheet.NamedStyles<IFormStyles> =>
  StyleSheet.create<IFormStyles>({
    container: {
      flex: 1,
      width: isDesktop ? '45%' : '100%',
    },
    socialMediaContainer: {
      marginTop: 36,
      alignSelf: 'center',
      width: '50%',
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
    newUser: {
      flexDirection: 'row',
      top: 30,
    },
    createAccount: {
      color: theme.colors.primaryColor,
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
