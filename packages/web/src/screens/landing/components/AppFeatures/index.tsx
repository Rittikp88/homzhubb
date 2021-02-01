import React, { FC, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import ToggleButtons from '@homzhub/web/src/components/molecules/ToggleButtons';
import FeatureCard from '@homzhub/web/src/screens/landing/components/AppFeatures/FeatureCard';
import MobileImage from '@homzhub/web/src/screens/landing/components/AppFeatures/MobileImage';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const AppFeatures: FC = () => {
  const { t } = useTranslation();
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const isTablet = useDown(deviceBreakpoint.TABLET);
  const [image, setImage] = useState(require('@homzhub/common/src/assets/images/defaultMobileBackground.svg'));
  const [isOwner, setIsOwner] = useState(true);
  const styles = containerStyles(isMobile);
  const relativeImage = (data: string): void => {
    setImage(data);
  };
  const toggleOwner = (): void => {
    setIsOwner(true);
    setImage(require('@homzhub/common/src/assets/images/defaultMobileBackground.svg'));
  };
  const toggleTenant = (): void => {
    setIsOwner(false);
    setImage(require('@homzhub/common/src/assets/images/defaultMobileBackground.svg'));
  };

  return (
    <View style={styles.containers}>
      <View style={styles.content}>
        <Typography variant="text" size="small" style={styles.title} fontWeight="semiBold">
          {t('landing:appFeatures')}
        </Typography>

        <Typography variant={isMobile ? 'text' : 'title'} size="large" fontWeight="semiBold" style={styles.subHeading}>
          {t('landing:appFeatureTitle')}
        </Typography>
      </View>
      <ToggleButtons
        toggleButton1Text={t('property:owner')}
        toggleButton2Text={t('property:tenant')}
        toggleButton1={toggleOwner}
        toggleButton2={toggleTenant}
        buttonStyle={styles.buttonContainer}
      />

      {(isOwner || isMobile || isTablet) && (
        <View style={styles.body}>
          <FeatureCard onDataPress={relativeImage} isOwner={isOwner} />
          <MobileImage relativeImage={image} isOwner={isOwner} />
        </View>
      )}
      {!isOwner && !isMobile && !isTablet && (
        <View style={styles.body}>
          <MobileImage relativeImage={image} isOwner={isOwner} />
          <FeatureCard onDataPress={relativeImage} isOwner={isOwner} />
        </View>
      )}
    </View>
  );
};

interface IContainerStyle {
  containers: ViewStyle;
  content: ViewStyle;
  title: ViewStyle;
  subHeading: ViewStyle;
  body: ViewStyle;
  buttonContainer: ViewStyle;
}

const containerStyles = (isMobile: boolean): StyleSheet.NamedStyles<IContainerStyle> =>
  StyleSheet.create<IContainerStyle>({
    containers: {
      backgroundColor: theme.colors.grey5,
    },
    content: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginHorizontal: '10%',
      marginBottom: 40,
    },
    title: {
      color: theme.colors.lightGreen,
      marginTop: 100,
    },
    subHeading: {
      marginTop: 21,
      marginBottom: 20,
      textAlign: 'center',
      color: theme.colors.darkTint2,
    },
    body: {
      top: 58,
      marginBottom: isMobile ? '5%' : '15%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer: {
      width: isMobile ? 130 : 148,
      height: 46,
    },
  });

export default AppFeatures;
