import React, { useState, FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import ToggleButtons from '@homzhub/web/src/components/molecules/ToggleButtons';
import PlatformPlanSection from '@homzhub/web/src/screens/landing/components/PlansSection/PlatformPlanSection';
import ServicePlansCard from '@homzhub/web/src/screens/landing/components/PlansSection/ServicePlansCard';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const PlansSection: FC = () => {
  const { t } = useTranslation(LocaleConstants.namespacesKey.common);
  const [isServicePlans, setIsServicePlans] = useState(false);
  const togglePlatformPlans = (): void => {
    setIsServicePlans(false);
  };
  const toggleServicePlans = (): void => {
    setIsServicePlans(true);
  };
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  return (
    <View>
      <View style={styles.plansTextContainer}>
        <Typography variant="label" size="large" fontWeight="semiBold" style={styles.plansTitle}>
          {t('plansSectionTitle')}
        </Typography>
        <Typography variant={isMobile ? 'text' : 'title'} size="large" fontWeight="semiBold" style={styles.plansHeader}>
          {t('plansSectionHeader')}
        </Typography>
      </View>
      <ToggleButtons
        toggleButton1Text="Platform Plans"
        toggleButton2Text="Service Plans"
        toggleButton1={togglePlatformPlans}
        toggleButton2={toggleServicePlans}
      />
      {isServicePlans ? <ServicePlansCard /> : <PlatformPlanSection />}
    </View>
  );
};
export default PlansSection;

const styles = StyleSheet.create({
  plansTitle: {
    color: theme.colors.lightGreen,
    paddingVertical: 12,
  },
  plansHeader: {
    color: theme.colors.darkTint2,
    textAlign: 'center',
    paddingVertical: 12,
  },
  plansTextContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
});
