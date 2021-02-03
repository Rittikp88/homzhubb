import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import ToggleButtons from '@homzhub/web/src/components/molecules/ToggleButtons';
import PlatformPlanSection from '@homzhub/web/src/screens/landing/components/PlansSection/PlatformPlanSection';
import ServicePlansSection from '@homzhub/web/src/screens/landing/components/PlansSection/ServicePlansSection';
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
  const onlyTablet = useOnly(deviceBreakpoint.TABLET);
  return (
    <View>
      <View style={styles.plansTextContainer}>
        <Typography
          variant={!isMobile ? 'text' : 'label'}
          size={!isMobile ? 'small' : 'large'}
          fontWeight="semiBold"
          style={styles.plansTitle}
        >
          {t('plansSectionTitle')}
        </Typography>
        <Typography
          variant={isMobile ? 'text' : 'title'}
          size={onlyTablet ? 'regular' : 'large'}
          fontWeight="semiBold"
          style={styles.plansHeader}
        >
          {t('plansSectionHeader')}
        </Typography>
      </View>
      <ToggleButtons
        toggleButton1Text={t('landing:platformPlans')}
        toggleButton2Text={t('landing:servicePlans')}
        toggleButton1={togglePlatformPlans}
        toggleButton2={toggleServicePlans}
        containerStyle={styles.toggleContainerStyle}
        buttonStyle={[styles.buttonStyle, isMobile && styles.buttonStyleMobile]}
        titleStyle={styles.titleStyle}
      />
      {isServicePlans ? <ServicePlansSection /> : <PlatformPlanSection />}
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
    width: '90%',
    paddingVertical: 12,
  },
  plansTextContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  toggleContainerStyle: {
    backgroundColor: theme.colors.white,
    marginBottom: 50,
  },
  buttonStyle: {
    width: 175,
  },
  buttonStyleMobile: {
    width: 130,
  },
  titleStyle: {
    marginVertical: 12,
    marginHorizontal: 30,
  },
});
