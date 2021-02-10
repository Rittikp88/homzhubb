/* eslint-disable react/jsx-no-undef */
import React, { FC, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { History } from 'history';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { CommonActions } from '@homzhub/common/src/modules/common/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { IWebProps } from '@homzhub/common/src/components/molecules/FormTextInput';
import PhoneCodePrefix from '@homzhub/web/src/components/molecules/PhoneCodePrefix';
import { SignupCarousal } from '@homzhub/web/src/components/organisms/signUpCarousal/index';
import { SignUpForm } from '@homzhub/common/src/components/organisms/SignUpForm';
import UserValidationScreensTemplate from '@homzhub/web/src/components/hoc/UserValidationScreensTemplate';
import { UserRepository } from '@homzhub/common/src/domain/repositories/UserRepository';
import { ISignUpPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IOwnProps {
  history: History;
}

type IProps = IOwnProps;

const SignUp: FC<IProps> = (props: IProps) => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(CommonActions.getCountries());
    dispatch(CommonActions.setDeviceCountry('IN'));
  }, []);

  const onFormSubmit = async (formData: ISignUpPayload): Promise<void> => {
    try {
      const isEmailUsed = await UserRepository.emailExists(formData.email);
      if (isEmailUsed.is_exists) {
        AlertHelper.error({ message: t('auth:emailAlreadyExists') });
        return;
      }

      const phone = `${formData.phone_code}~${formData.phone_number}`;
      const isPhoneUsed = await UserRepository.phoneExists(phone);
      if (isPhoneUsed.is_exists) {
        AlertHelper.error({ message: t('auth:phoneAlreadyExists') });
        return;
      }

      if (formData.signup_referral_code) {
        const isValidCode = await UserRepository.verifyReferalCode(formData.signup_referral_code);
        if (!isValidCode.is_applicable) {
          AlertHelper.error({ message: t('auth:invalidReferralCodeError') });
          return;
        }
      }

      // TODO: ONCE THE DATA IS VALIDATED NAVIGATE TO OTP SCREEN
    } catch (err) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(err.details) });
    }
  };

  const handleTermsCondition = (): void => {
    NavigationUtils.navigate(props.history, { path: RouteNames.publicRoutes.TERMS_CONDITION });
  };

  const handleWebView = (params: IWebProps): React.ReactElement => {
    return <PhoneCodePrefix {...params} />;
  };
  const isDesktop = useOnly(deviceBreakpoint.DESKTOP);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const containerStyle = isDesktop
    ? styles.containerStyle
    : isMobile
    ? styles.containerStyleMobile
    : styles.containerStyleTablet;
  return (
    <View style={styles.container}>
      <UserValidationScreensTemplate
        hasBackButton={false}
        containerStyle={containerStyle}
        title={t('common:signUp')}
        subTitle={t('common:createAccount')}
      >
        <View style={[styles.formContainer, isMobile && styles.formContainerMobile]}>
          <SignUpForm
            onSubmitFormSuccess={onFormSubmit}
            onPressLink={handleTermsCondition}
            referralCode=""
            testID="signupForm"
            webGroupPrefix={handleWebView}
          />
        </View>
      </UserValidationScreensTemplate>
      <SignupCarousal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  containerStyle: {
    backgroundColor: theme.colors.white,
    width: '45%',
  },
  containerStyleMobile: {
    width: '100%',
  },
  containerStyleTablet: {
    width: '100%',
  },
  submitStyle: {
    flex: 0,
    marginTop: 30,
  },
  formContainer: {
    width: '55%',
    marginHorizontal: 'auto',
  },
  formContainerMobile: {
    width: '90%',
  },
});

export default SignUp;
