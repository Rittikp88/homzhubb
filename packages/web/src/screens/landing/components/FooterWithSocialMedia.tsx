import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import StoreButton, { imageType } from '@homzhub/web/src/components/molecules/MobileStoreButton';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

export const FooterWithSocialMedia: FC = () => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.common);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const socialMediaLinks: imageType[] = ['instagram', 'twitter', 'youtube', 'linkedin', 'facebook'];

  return (
    <View style={[styles.footerContainer]}>
      <View style={[styles.contentMobile, !isMobile && styles.content]}>
        <View style={styles.copyrightTextContainer}>
          <Typography variant="label" size="regular" style={styles.copyrightText}>
            {t('copyrightContent')}
          </Typography>
          <Typography variant="label" size="regular" fontWeight="semiBold" style={styles.copyrightText}>
            {t('homzhubLink')}
          </Typography>
        </View>
        <View style={styles.socialMediaIcons}>
          <Typography size="small" style={styles.socialMediaText}>
            {t('common:footerSocialMediaText')}
          </Typography>
          {socialMediaLinks.map((icon) => {
            return (
              <StoreButton
                key={`social-media-icon-${icon}`}
                store={icon}
                containerStyle={styles.icons}
                imageIconStyle={styles.imageIconStyle}
                mobileImageIconStyle={styles.mobileImageIconStyle}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default FooterWithSocialMedia;

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: theme.colors.footerBlue,
    justifyContent: 'center',
    paddingVertical: 10,
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: theme.layout.dashboardWidth,
  },
  contentMobile: {
    width: theme.layout.dashboardMobileWidth,
    alignContent: 'center',
    justifyContent: 'center',
  },
  copyrightTextContainer: {
    flexDirection: 'row',
  },
  copyrightText: {
    color: theme.colors.white,
  },
  socialMediaText: {
    color: theme.colors.white,
  },
  socialMediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icons: {
    width: 50,
    height: 50,
  },
  imageIconStyle: {
    width: 25,
    height: 25,
    resizeMode: 'stretch',
    maxWidth: '100%',
    marginVertical: 'auto',
  },
  mobileImageIconStyle: {
    width: '50%',
  },
});
