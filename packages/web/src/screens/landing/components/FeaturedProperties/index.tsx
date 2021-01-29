import React, { useEffect, useState } from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { GraphQLRepository, IFeaturedProperties } from '@homzhub/common/src/domain/repositories/GraphQLRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import PropertiesCarousel from '@homzhub/web/src/components/molecules/PropertiesCarousel';

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
  return (
    <View style={styles.container}>
      <Text type="regular" style={styles.titleText}>
        {t('landing:recent')}
      </Text>
      <Text type="large" style={styles.subTitleText}>
        {t('landing:featuredTitle')}
      </Text>
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
