import React, { FC, useState, useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { History } from 'history';
import { useDown, useOnly, useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { UserActions } from '@homzhub/common/src/modules/user/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { LoginForm } from '@homzhub/common/src/components/organisms/LoginForm';
import PhoneCodePrefix from '@homzhub/web/src/components/molecules/PhoneCodePrefix';
import UserValidationScreensTemplate from '@homzhub/web/src/components/hoc/UserValidationScreensTemplate';
import { GetToKnowUsCarousel } from '@homzhub/web/src/components/organisms/GetToKnowUsCarousel';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ILoginFormData, ILoginPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IWebProps } from '@homzhub/common/src/components/molecules/FormTextInput';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { OtpNavTypes } from '@homzhub/web/src/components/organisms/OtpVerification';
import { ISocialUserData } from '@homzhub/common/src/constants/SocialAuthProviders';

interface IStateProps {
  isLoading: boolean;
}

interface IDispatchProps {
  login: (payload: ILoginPayload) => void;
}

interface IOwnProps {
  history: History;
  title: string;
  subTitle: string;
  buttonTitle: string;
  underlineDesc: string;
  socialUserData?: ISocialUserData;
  isFromLogin?: boolean;
}

type IProps = IStateProps & IDispatchProps & IOwnProps;

const MobileVerification: FC<IProps> = (props: IProps) => {
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);
  const styles = formStyles(isMobile, isDesktop);
  const { t } = useTranslation(LocaleConstants.namespacesKey.common);
  const [isEmailLogin, setIsEmailLogin] = useState(false);
  const { title, subTitle, buttonTitle, underlineDesc } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(CommonActions.getCountries());
    dispatch(CommonActions.setDeviceCountry('IN'));
  }, []);

  const navigateToHomeScreen = (): void => {
    NavigationUtils.navigate(props.history, { path: RouteNames.protectedRoutes.DASHBOARD });
  };
  const backToLoginWithPhone = (): void => {
    setIsEmailLogin(false);
  };
  const handleForgotPassword = (): void => {
    // TODO: Add redirection logic for password reset.
  };
  const handleOtpLogin = (values: ILoginFormData): void => {
    const { phone_code, phone_number } = values;
    const compProps = {
      phoneCode: phone_code,
      otpSentTo: phone_number,
      type: OtpNavTypes.Login,
      onCallback: navigateToHomeScreen,
    };
    NavigationUtils.navigate(props.history, {
      path: RouteNames.publicRoutes.OTP_VERIFICATION,
      params: { ...compProps },
    });
  };
  const handleWebView = (params: IWebProps): React.ReactElement => {
    return <PhoneCodePrefix {...params} />;
  };
  return (
    <View style={styles.container}>
      <UserValidationScreensTemplate
        title={title || t('login')}
        subTitle={subTitle || t('auth:loginToAccessHomzhubPhone')}
        containerStyle={[styles.containerStyle, isTablet && styles.containerStyleTablet]}
        hasBackButton={isEmailLogin}
        backButtonPressed={backToLoginWithPhone}
        isUnderlineDesc
        underlineDesc={underlineDesc}
      >
        <View style={styles.loginForm}>
          <LoginForm
            onLoginSuccess={handleOtpLogin}
            handleForgotPassword={handleForgotPassword}
            testID="loginFormWeb"
            webGroupPrefix={handleWebView}
            title={title}
            subTitle={subTitle}
            buttonTitle={buttonTitle}
          />
        </View>
      </UserValidationScreensTemplate>
      <GetToKnowUsCarousel />
    </View>
  );
};

interface IFormStyles {
  container: ViewStyle;
  containerStyle: ViewStyle;
  containerStyleTablet: ViewStyle;
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
      flexDirection: 'row',
    },
    containerStyle: {
      backgroundColor: theme.colors.white,
      width: '45%',
    },
    containerStyleTablet: {
      width: '100%',
      alignItems: undefined,
      paddingHorizontal: undefined,
      paddingTop: '20%',
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

export default connect<IStateProps, IDispatchProps, {}, IState>(
  mapStateToProps,
  mapDispatchToProps
)(MobileVerification);
