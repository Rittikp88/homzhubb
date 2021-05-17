import React, { FC } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const ErrorGeneric: FC = () => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.common);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const isTablet = useOnly(deviceBreakpoint.TABLET);
  const history = useHistory();

  const bannerImage = {
    height: 280,
    width: 200,
  };
  const navigateToScreen = (): void => {
    NavigationUtils.navigate(history, { path: RouteNames.publicRoutes.APP_BASE });
  };
  return (
    <View style={styles.comingSoonContent}>
      <Image source={require('@homzhub/common/src/assets/images/ErrorOops.svg')} style={bannerImage} />
      <View style={styles.errorMessageTitle}>
        <Text type="large">{t('error:genericError')}</Text>
      </View>
      <View style={[styles.errorMessage, isTablet && styles.errorMessageTablet, isMobile && styles.errorMessageMobile]}>
        <Text type="small">{t('error:genericErrorMessage')}</Text>
      </View>
      <View style={styles.errorMessageTitle}>
        <Button
          type="primary"
          title={t('error:backToHome')}
          fontType="semiBold"
          textSize="small"
          onPress={(): void => navigateToScreen()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  comingSoonContent: {
    height: '96vh',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    marginBottom: 24,
    width: '100vw',
    overflow: 'hidden',
  },
  errorMessage: {
    marginTop: 30,
    width: 500,
    textAlign: 'center',
  },
  errorMessageMobile: {
    width: 300,
  },
  errorMessageTablet: {
    width: 400,
  },
  errorMessageTitle: {
    marginTop: 38,
  },
  titleStyle: {
    fontWeight: '700',
  },
});

export default ErrorGeneric;
