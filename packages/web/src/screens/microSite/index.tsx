import React, { FC } from 'react';
import { View } from 'react-native';
import BannerVideo from '@homzhub/web/src/screens/microSite/components/BannerVideo';
import Properties from '@homzhub/web/src/screens/microSite/components/Properties';
import HomzhubServices from '@homzhub/web/src/screens/microSite/components/HomzhubServices';
import OverViewSteps from '@homzhub/web/src/screens/microSite/components/OverViewSteps';
import StartYourInvestment from '@homzhub/web/src/screens/microSite/components/StartYourInvestment';
import Testimonials from '@homzhub/web/src/screens/microSite/components/Testimonials';
import OurServicesSection from '@homzhub/web/src/screens/landing/components/OurServicesSection';
import FooterWithSocialMedia from '@homzhub/web/src/screens/landing/components/FooterWithSocialMedia';

const MicroSite: FC = () => {
  return (
    <View>
      <BannerVideo />
      <OverViewSteps />
      <HomzhubServices />
      <StartYourInvestment />
      <Properties />
      <Testimonials />
      <OurServicesSection />
      <FooterWithSocialMedia />
    </View>
  );
};

export default MicroSite;
