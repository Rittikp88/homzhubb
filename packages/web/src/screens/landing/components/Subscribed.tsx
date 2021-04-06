import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import ThankYou from '@homzhub/common/src/assets/images/subscribed.svg';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const Subscribed = (): React.ReactElement => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.landing);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <View style={styles.alignToCenter}>
        <ThankYou />
      </View>
      <View style={styles.alignToCenter}>
        <Typography variant="title" size="small" fontWeight="semiBold" style={styles.headerText}>
          {t('thankYouText')}
        </Typography>
        <Typography variant="text" size="small" fontWeight="regular" style={styles.titleText}>
          {t('thankYouTitle')}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 54,
  },
  containerMobile: {
    padding: 24,
    paddingBottom: 36,
  },
  alignToCenter: {
    alignItems: 'center',
  },
  image: {
    paddingHorizontal: 18,
  },
  headerText: {
    textAlign: 'center',
    marginTop: 12,
  },
  titleText: {
    textAlign: 'center',
    marginTop: 12,
  },
});

export default Subscribed;
