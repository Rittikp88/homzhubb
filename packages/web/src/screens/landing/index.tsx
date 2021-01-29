import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import LandingNavBar from '@homzhub/web/src/screens/landing/components/LandingNavBar';
import HeroSection from '@homzhub/web/src/screens/landing/components/HeroSection';
import LandingFeatures from '@homzhub/web/src/screens/landing/components/LandingFeatures';
import AppFeatures from '@homzhub/web/src/screens/landing/components/AppFeatures';
import PromiseSection from '@homzhub/web/src/screens/landing/components/PromiseSection';
import { LandingYoutubeSection } from '@homzhub/web/src/screens/landing/components/LandingYoutubeSection';
import FeaturedProperties from '@homzhub/web/src/screens/landing/components/FeaturedProperties';
import PlansSection from '@homzhub/web/src/screens/landing/components/PlansSection';
import Testimonials from '@homzhub/web/src/screens/landing/components/Testimonials';
import { StoreLinkSection } from '@homzhub/web/src/screens/landing/components/StoreLinksSection';
import AboutHomzhub from '@homzhub/web/src/screens/landing/components/AboutHomzhub';
import OurServicesSection from '@homzhub/web/src/screens/landing/components/OurServicesSection';
import FooterWithSocialMedia from '@homzhub/web/src/screens/landing/components/FooterWithSocialMedia';

const Landing: FC = () => {
  return (
    <View style={styles.container}>
      <LandingNavBar />
      <HeroSection />
      <LandingFeatures />
      <AppFeatures />
      <PromiseSection />
      <LandingYoutubeSection />
      <FeaturedProperties />
      <PlansSection />
      <StoreLinkSection />
      <Testimonials />
      <AboutHomzhub />
      <OurServicesSection />
      <FooterWithSocialMedia />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
});

export default Landing;
