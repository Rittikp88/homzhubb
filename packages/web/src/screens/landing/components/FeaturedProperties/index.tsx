import React, { useEffect, useState } from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { GraphQLRepository, IFeaturedProperties } from '@homzhub/common/src/domain/repositories/GraphQLRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import PropertiesCarousel from '@homzhub/web/src/components/molecules/PropertiesCarousel';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import '@homzhub/web/src/screens/landing/components/FeaturedProperties/FeaturedProperties.scss';

const FeaturedProperties: React.FC = () => {
  const { t } = useTranslation();
  const [featuredProperties, setFeaturedProperties] = useState<IFeaturedProperties[]>([]);
  const getFeaturedProperties = async (): Promise<void> => {
    const response = await GraphQLRepository.getFeaturedProperties();
    setFeaturedProperties(response);
  };
  const styles = featuredPropertiesStyle();
  useEffect(() => {
    getFeaturedProperties().then();
  }, []);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const onlyTablet = useOnly(deviceBreakpoint.TABLET);
  return (
    <View style={styles.container}>
      <Typography
        variant={!isMobile ? 'text' : 'label'}
        size={!isMobile ? 'small' : 'large'}
        fontWeight="semiBold"
        style={styles.titleText}
      >
        {t('landing:recent')}
      </Typography>
      <Typography
        variant={isMobile ? 'text' : 'title'}
        size={onlyTablet ? 'regular' : 'large'}
        fontWeight="semiBold"
        style={styles.subTitleText}
      >
        {t('landing:featuredTitle')}
      </Typography>
      <View style={styles.carouselContainer}>
        <PropertiesCarousel featuredProperties={featuredProperties} />
      </View>
    </View>
  );
};

interface ITestimonialStyle {
  container: ViewStyle;
  titleText: TextStyle;
  subTitleText: TextStyle;
  carouselContainer: ViewStyle;
}

const featuredPropertiesStyle = (): StyleSheet.NamedStyles<ITestimonialStyle> =>
  StyleSheet.create<ITestimonialStyle>({
    container: {
      flex: 1,
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      backgroundColor: theme.colors.grey5,
    },
    titleText: {
      color: theme.colors.lightGreen,
      marginBottom: 24,
      marginTop: 120,
    },
    subTitleText: {
      color: theme.colors.darkTint2,
      marginBottom: 70,
    },
    carouselContainer: {
      flexDirection: 'column',
      width: theme.layout.dashboardWidth,
      marginBottom: 120,
    },
  });

export default FeaturedProperties;
