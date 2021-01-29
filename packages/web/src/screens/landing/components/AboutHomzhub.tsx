import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import StoreButton from '@homzhub/web/src/components/molecules/MobileStoreButton';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const AboutHomzhub: FC = () => {
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      <View style={[styles.subContainer, isMobile && styles.subContainerMobile]}>
        <Typography variant="text" size="regular" fontWeight="semiBold" style={styles.title}>
          {t('aboutHomzhub')}
        </Typography>
        <Text style={[styles.text, isMobile && styles.mobileText]} type="small">
          {t('aboutDescription')}
        </Text>
        <View style={[styles.buttonContainer, isMobile && styles.mobileContainer]}>
          <StoreButton
            store="apple"
            containerStyle={styles.button}
            imageIconStyle={styles.imageIconStyle}
            mobileImageIconStyle={styles.mobileImageIconStyle}
          />

          <StoreButton
            store="google"
            containerStyle={styles.googleButton}
            imageIconStyle={styles.imageIconStyle}
            mobileImageIconStyle={styles.mobileImageIconStyle}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
  subContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: theme.layout.dashboardWidth,
  },
  containerMobile: {
    marginBottom: 35,
  },
  subContainerMobile: {
    width: theme.layout.dashboardMobileWidth,
    alignItems: 'center',
  },
  title: {
    color: theme.colors.darkTint4,
    width: 'auto',
  },
  text: {
    width: '58%',
    marginTop: 16,
    color: theme.colors.darkTint4,
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  mobileText: {
    width: '100%',
  },
  button: {
    width: '100%',
    maxWidth: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '20%',
  },
  googleButton: {
    width: '100%',
    maxWidth: '100%',
    marginLeft: 20,
  },

  mobileContainer: {
    width: '100%',
    alignSelf: 'center',
  },
  imageIconStyle: {
    width: '100%',
    height: 100,
    resizeMode: 'stretch',
    maxWidth: '100%',
  },
  mobileImageIconStyle: {
    width: '50%',
  },
});

export default AboutHomzhub;
