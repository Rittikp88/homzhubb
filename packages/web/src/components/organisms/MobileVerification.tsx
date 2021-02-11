import React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { OtpInputs, OtpTypes } from '@homzhub/common/src/components/molecules/OtpInputs';
import { GetToKnowUsCarousel } from '@homzhub/web/src/components/organisms/GetToKnowUsCarousel';
import UserValidationScreensTemplate from '@homzhub/web/src/components/hoc/UserValidationScreensTemplate';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

enum OtpNavTypes {
  Login = 'Login',
  SignUp = 'SignUp',
  SocialMedia = 'SocialMedia',
  UpdateProfileByEmailPhoneOtp = 'UpdateProfileByEmailPhoneOtp',
  UpdateProfileByOtp = 'UpdateProfileByOtp',
} // todos Required for integration of diffrent type of signin flows
const MobileVerification: React.FC = () => {
  const styles = mobileVerificationStyle();
  const handleOtpVerification = async (otp: string, otpType?: OtpTypes): Promise<void> => {
    //   await verifyOtp(otp); //Required handler for primary field of verification form
  };
  const toggleError = FunctionUtils.noop;
  const verifyOtp = FunctionUtils.noop;
  const onIconPress = FunctionUtils.noop;
  const onResendPress = FunctionUtils.noop;
  const { t } = useTranslation();
  const seconds = 5;
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);

  return (
    <View style={styles.container}>
      <UserValidationScreensTemplate
        title={t('auth:verifyNumber')}
        subTitle={t('auth:enterOtpWeb')}
        hasBackButton
        containerStyle={[
          styles.formContainer,
          isTablet && styles.formContainerTablet,
          isMobile && styles.formContainerMobile,
        ]}
      >
        <View style={isMobile ? styles.mobileVerificationContainerMobile : styles.mobileVerificationContainer}>
          <View style={styles.numberContainer}>
            <Typography variant="text" size="small" fontWeight="semiBold">
              9898989898
            </Typography>
            <Icon
              name={icons.noteBook}
              size={18}
              color={theme.colors.active}
              onPress={onIconPress}
              style={styles.editIcon}
              testID="icnEdit"
            />
          </View>
          <View>
            <OtpInputs bubbleOtp={handleOtpVerification} toggleError={toggleError} />
          </View>
          <View style={styles.resendTextContainer}>
            <Typography variant="label" size="large" fontWeight="regular" style={styles.notReceiveOtpText}>
              {`${t('auth:receiveOtp')} `}
              {seconds > 0 ? (
                <Typography variant="label" size="large" fontWeight="semiBold">
                  {t('auth:resendIn', { sec: seconds })}
                </Typography>
              ) : (
                <Typography
                  variant="label"
                  size="large"
                  fontWeight="semiBold"
                  style={styles.resendText}
                  onPress={onResendPress}
                >
                  {t('auth:resend')}
                </Typography>
              )}
            </Typography>
          </View>
          <Button type="primary" title={t('auth:signup')} containerStyle={[styles.signupButtonStyle]} />
        </View>
      </UserValidationScreensTemplate>
      <GetToKnowUsCarousel />
    </View>
  );
};

interface IVerificationStyle {
  container: ViewStyle;
  formContainer: ViewStyle;
  carousalContainer: ViewStyle;
  logo: ViewStyle;
  verifyText: TextStyle;
  otpText: TextStyle;
  numberContainer: ViewStyle;
  editIcon: ViewStyle;
  resendTextContainer: ViewStyle;
  notReceiveOtpText: TextStyle;
  resendText: TextStyle;
  signupButtonStyle: ViewStyle;
  formContainerMobile: ViewStyle;
  formContainerTablet: ViewStyle;
  mobileVerificationContainer: ViewStyle;
  mobileVerificationContainerMobile: ViewStyle;
}

const mobileVerificationStyle = (): StyleSheet.NamedStyles<IVerificationStyle> =>
  StyleSheet.create<IVerificationStyle>({
    container: {
      flexDirection: 'row',
      width: '100vw',
      height: '100vh',
    },
    mobileVerificationContainer: {
      marginHorizontal: 'auto',
      width: '55%',
    },
    mobileVerificationContainerMobile: {
      width: '90%',
    },
    formContainer: {
      width: '45vw',
      alignItems: 'flex-start',
    },
    formContainerMobile: {
      width: '100vw',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: '20%',
    },
    formContainerTablet: {
      width: '100%',
      alignItems: undefined,
      paddingHorizontal: undefined,
      paddingTop: '20%',
    },
    carousalContainer: {
      width: '55vw',
      backgroundColor: theme.colors.grey1,
    },
    logo: {
      marginBottom: '4%',
    },
    verifyText: {
      marginTop: '2%',
    },
    otpText: {
      color: theme.colors.darkTint3,
    },
    numberContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: '2%',
    },
    editIcon: {
      marginLeft: '1%',
    },
    resendTextContainer: {
      flexDirection: 'row',
      marginTop: '2%',
    },
    notReceiveOtpText: {
      color: theme.colors.darkTint4,
    },
    resendText: {
      color: theme.colors.active,
    },
    signupButtonStyle: {
      marginTop: '7%',
    },
  });
export default MobileVerification;
