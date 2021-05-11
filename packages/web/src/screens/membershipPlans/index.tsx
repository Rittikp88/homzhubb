import React, { FC, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import PricingSection from '@homzhub/web/src/screens/membershipPlans/components/PricingSection';
import LandingNavBar from '@homzhub/web/src/screens/landing/components/LandingNavBar';
import { GradientBackground } from 'screens/landing/components/GradientBackground';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import ToggleButtons from '@homzhub/web/src/components/molecules/ToggleButtons';

const MembershipPlans: FC = () => {
  const [isPlatformPlan, setIsPlatformPlan] = useState(true); // service plan integration purpose
  const { t } = useTranslation();
  const togglePlatform = (): void => {
    setIsPlatformPlan(true);
  };
  const toggleService = (): void => {
    setIsPlatformPlan(false);
  };

  return (
    <View style={styles.container}>
      <LandingNavBar />
      <GradientBackground>
        <Typography fontWeight="semiBold" variant="title" size="regular" style={styles.header}>
          {t('common:plansSectionHeader')}
        </Typography>
      </GradientBackground>

      <View style={styles.button}>
        <ToggleButtons
          toggleButton1Text={t('landing:platformPlans')}
          toggleButton2Text={t('landing:servicePlans')}
          toggleButton1={togglePlatform}
          toggleButton2={toggleService}
          buttonStyle={styles.buttonContainer}
        />
        <Typography fontWeight="regular" variant="text" size="regular" style={styles.subText}>
          {isPlatformPlan ? t('landing:platformPlansHeader') : t('landing:servicePlansHeader')}
        </Typography>
      </View>
      {isPlatformPlan && <PricingSection />}
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
  button: { top: 60 },
  header: { marginTop: 125, marginBottom: 80, marginHorizontal: 'auto', color: theme.colors.white },
  subText: { marginTop: 30, marginBottom: '10%', marginHorizontal: 'auto' },
});
