import React, { FC } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import LogoWithName from '@homzhub/common/src/assets/images/appLogoWithName.svg';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  children: React.ReactElement | React.ReactNode;
  title: string;
  subTitle: string;
  containerStyle: ViewStyle;
  hasBackButton?: boolean;
  hasBackToLoginButton?: boolean;
  navigationPath?: string;
}

const UserValidationScreensTemplate: FC<IProps> = (props: IProps) => {
  const { children, title, subTitle, containerStyle, hasBackToLoginButton, hasBackButton, navigationPath } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.common);
  const history = useHistory();
  const isMobile = useDown(deviceBreakpoint.MOBILE);

  const backButtonNavigation = (): void => {
    if (navigationPath) NavigationUtils.navigate(history, { path: navigationPath });
  };

  const navigateToLogin = (): void => {
    NavigationUtils.navigate(history, { path: RouteNames.publicRoutes.LOGIN });
  };

  return (
    <View style={containerStyle}>
      <View style={isMobile ? styles.userValidationCommonContentMobile : styles.userValidationCommonContent}>
        <View style={styles.logo}>
          <LogoWithName />
        </View>
        {hasBackButton && (
          <Button type="secondary" onPress={backButtonNavigation} containerStyle={styles.backButton}>
            <Icon name={icons.longArrowLeft} />
          </Button>
        )}
        <Typography variant="text" size="regular" fontWeight="semiBold">
          {title}
        </Typography>
        <Typography variant="label" size="large">
          {subTitle}
        </Typography>
      </View>
      {children}
      {hasBackToLoginButton && (
        <Button
          type="secondary"
          title={t('auth:backToLogin')}
          containerStyle={styles.backToLoginButton}
          titleStyle={styles.backToLoginButtonText}
          onPress={navigateToLogin}
        />
      )}
    </View>
  );
};

export default UserValidationScreensTemplate;

const styles = StyleSheet.create({
  logo: {
    marginVertical: 50,
  },
  backButton: {
    marginBottom: 25,
    borderWidth: 0,
    width: 'fit-content',
  },
  userValidationCommonContent: {
    marginHorizontal: 'auto',
    width: '55%',
  },
  userValidationCommonContentMobile: {
    marginHorizontal: 'auto',
    width: '90%',
  },
  backToLoginButton: {
    borderWidth: 0,
    width: 'fit-content',
    marginTop: 30,
    marginHorizontal: 'auto',
  },
  backToLoginButtonText: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
});