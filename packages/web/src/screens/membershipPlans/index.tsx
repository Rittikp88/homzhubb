import React, { FC, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { GradientBackground } from '@homzhub/web/src/screens/landing/components/GradientBackground';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import FooterWithSocialMedia from '@homzhub/web/src/screens/landing/components/FooterWithSocialMedia';
import LandingNavBar from '@homzhub/web/src/screens/landing/components/LandingNavBar';
import PlatformPlan from '@homzhub/web/src/screens/membershipPlans/components/PlatformPlan';
import ServicePlansSection from '@homzhub/web/src/screens/membershipPlans/components/ServicePlansSection';
import OurServicesSection from '@homzhub/web/src/screens/landing/components/OurServicesSection';

const MembershipPlans: FC = () => {
  const [isPlatformPlan, setIsPlatformPlan] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const { t } = useTranslation();

  const onTabChange = (argSelectedTab: number): void => {
    setSelectedTab(argSelectedTab);
    setIsPlatformPlan(!isPlatformPlan);
  };
  return (
    <View style={styles.container}>
      <LandingNavBar membershipPlan />
      <View>
        <GradientBackground>
          <Typography fontWeight="semiBold" variant="title" size="regular" style={styles.header}>
            {t('common:plansSectionHeader')}
          </Typography>
        </GradientBackground>
      </View>
      <View style={styles.button}>
        <SelectionPicker
          data={[
            { title: t('landing:platformPlans'), value: 0 },
            { title: t('landing:servicePlans'), value: 1 },
          ]}
          selectedItem={[selectedTab]}
          onValueChange={onTabChange}
          itemWidth={210}
          containerStyles={styles.pickerContainer}
          primary={false}
        />
        <Typography fontWeight="regular" variant="text" size="regular" style={styles.subText}>
          {isPlatformPlan ? t('landing:platformPlansHeader') : t('landing:servicePlansHeader')}
        </Typography>
      </View>

      {isPlatformPlan ? <PlatformPlan /> : <ServicePlansSection />}

      <OurServicesSection />
      <FooterWithSocialMedia />
    </View>
  );
};
export default MembershipPlans;
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  buttonContainer: {
    width: '210px',
    height: 46,
  },
  button: { paddingTop: 60, bottom: 10, alignItems: 'center' },
  header: { marginTop: 125, marginBottom: 80, marginHorizontal: 'auto', color: theme.colors.white },
  subText: { marginTop: 30, marginHorizontal: 'auto' },
  pickerContainer: { height: 54 },
});
