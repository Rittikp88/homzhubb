import React, { FC } from 'react';
import { StyleSheet, View, ImageStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import Family from '@homzhub/common/src/assets/images/familyPana.svg';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const PromiseSection: FC = () => {
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Typography variant="text" size="small" style={styles.title}>
            ADIPISCING
          </Typography>
        </View>
        <View>
          <Typography variant="title" size="large" fontWeight="semiBold" style={styles.header}>
            {t('ourPromise')}
          </Typography>
        </View>
      </View>
      <View style={[styles.valuesContainer, isMobile && styles.mobileContainer, isTablet && styles.mobileContainer]}>
        <View style={styles.imageContainer}>
          <Family style={imageStyles()} />
        </View>
        <View style={styles.text}>
          <Typography size="small" fontWeight="semiBold" style={styles.contentHeader}>
            {t('integrity')}
          </Typography>
          <Typography variant="text" size="small" style={styles.para}>
            {t('integrityDescription')}
          </Typography>

          <Typography size="small" fontWeight="semiBold" style={styles.contentHeader}>
            {t('trust')}
          </Typography>
          <Typography variant="text" size="small" style={styles.para}>
            {t('trustDescription')}
          </Typography>
          <Typography size="small" fontWeight="semiBold" style={styles.contentHeader}>
            {t('transparency')}
          </Typography>
          <Typography variant="text" size="small" style={styles.para}>
            {t('transparencyDescription')}
          </Typography>
        </View>
      </View>
    </View>
  );
};
// FIXME (Ashwin) use from stylesheet instead
const imageStyles = (): ImageStyle => {
  return {
    maxWidth: '100%',
  };
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: theme.colors.backgroundOpacity,
  },
  mobileContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  content: {
    alignItems: 'center',
  },
  header: {
    marginTop: 21,
    color: theme.colors.darkTint2,
  },
  title: {
    color: theme.colors.lightGreen,
    marginTop: 100,
  },
  image: {
    maxWidth: '100%',
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 65,
    marginVertical: 20,
  },
  imageContainer: {
    flexWrap: 'wrap',
  },
  text: {
    justifyContent: 'center',
    alignContent: 'center',
    flexShrink: 2,
    marginLeft: 30,
    marginTop: 40,
  },
  para: {
    marginBottom: 42,
    color: theme.colors.darkTint5,
  },

  contentHeader: {
    fontWeight: '500',
    marginBottom: 12,
    color: theme.colors.dark,
  },
});

export default PromiseSection;
