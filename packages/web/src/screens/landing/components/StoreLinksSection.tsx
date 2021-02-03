import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import StoreButton from '@homzhub/web/src/components/molecules/MobileStoreButton';
import { GradientBackground } from '@homzhub/web/src/screens/landing/components/GradientBackground';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

// todo replace dummy data
export const StoreLinkSection: FC = () => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.landing);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const notDesktop = useDown(deviceBreakpoint.TABLET);
  return (
    <View style={styles.container}>
      <GradientBackground>
        <View style={styles.content}>
          <Typography variant={notDesktop ? 'text' : 'title'} size="large" fontWeight="semiBold" style={styles.title}>
            {t('giveTry')}
          </Typography>
          <Typography variant="text" size="small" style={styles.title}>
            Download our apps to experience vestibulum nam eu orci. Gravida arcu proin rhoncus platea libero libero, sed
            tortor urna.
          </Typography>
          <View style={[styles.buttonContainer, notDesktop && styles.tabContainer, isMobile && styles.mobileContainer]}>
            <StoreButton
              store="appleLarge"
              containerStyle={styles.button}
              imageIconStyle={styles.imageIconStyle}
              mobileImageIconStyle={styles.appImageIconStyle}
            />
            <StoreButton
              store="googleLarge"
              containerStyle={[styles.googleButton, isMobile && styles.mobileButton]}
              imageIconStyle={styles.imageIconStyle}
              mobileImageIconStyle={styles.mobileImageIconStyle}
            />
          </View>
        </View>
      </GradientBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 372,
    width: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.white,
    marginBottom: 24,
    marginHorizontal: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '35%',
    height: 20,
  },
  button: {
    width: '100%',
    maxWidth: '100%',
  },
  googleButton: {
    width: '100%',
    maxWidth: '100%',
    marginHorizontal: 30,
  },
  mobileButton: {
    marginLeft: 5,
  },
  mobileContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  imageIconStyle: {
    width: '100%',
    height: 100,
    resizeMode: 'stretch',
    maxWidth: '100%',
  },
  mobileImageIconStyle: {
    width: '108px',
  },
  appImageIconStyle: {
    marginLeft: 'auto',
    width: '106px',
  },
  tabContainer: {
    width: '50%',
  },
});
