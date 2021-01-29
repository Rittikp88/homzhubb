import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
  const [image, setImage] = useState('Picture1');
  const [isOwner, setIsOwner] = useState(true);
  const relativeImage = (data: string): void => {
    setImage(data);
  };
  const toggleOwner = (): void => {
    setIsOwner(true);
  };
  const toggleTenant = (): void => {
    setIsOwner(false);
  };

  return (
    <View style={styles.containers}>
      <View style={styles.content}>
        <Typography variant="text" size="small" style={styles.title}>
          {t('landing:appFeatures')}
        </Typography>

        <Typography variant={isMobile ? 'text' : 'title'} size="large" fontWeight="semiBold" style={styles.subHeading}>
          {t('landing:appFeatureTitle')}
        </Typography>
      </View>
      <ToggleButtons
        toggleButton1Text="Owner"
        toggleButton2Text="Tentant"
        toggleButton1={toggleOwner}
        toggleButton2={toggleTenant}
      />

      {isOwner && (
        <View style={styles.body}>
          <FeatureCard onDataPress={relativeImage} isOwner={isOwner} />
          <MobileImage relativeImage={image} isOwner={isOwner} />
        </View>
      )}
      {!isOwner && (
        <View style={styles.body}>
          <MobileImage relativeImage={image} isOwner={isOwner} />
          <FeatureCard onDataPress={relativeImage} isOwner={isOwner} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  body: {
    marginTop: 58,
    marginBottom: 100,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default AppFeatures;
