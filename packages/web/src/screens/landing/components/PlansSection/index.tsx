import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useDown, useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import { SelectionPicker } from '@homzhub/common/src/components/atoms/SelectionPicker';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import PlatformPlanSection from '@homzhub/web/src/screens/landing/components/PlansSection/PlatformPlanSection';
import ServicePlansSection from '@homzhub/web/src/screens/landing/components/PlansSection/ServicePlansSection';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  scrollRef?: any;
}
const PlansSection: FC<IProps> = (props: IProps) => {
  const { scrollRef } = props;
  const { t } = useTranslation(LocaleConstants.namespacesKey.common);
  const [isServicePlans, setIsServicePlans] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const history = useHistory();

  const onTabChange = (argSelectedTab: number): void => {
    setSelectedTab(argSelectedTab);
    setIsServicePlans(!isServicePlans);
  };
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const onlyTablet = useOnly(deviceBreakpoint.TABLET);
  const navigateToMembershipPlans = (): void => {
    NavigationUtils.navigate(history, {
      path: RouteNames.publicRoutes.MEMBERSHIP_PLANS,
    });
  };
  return (
    <View ref={scrollRef}>
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

      <View style={styles.selectionPicker}>
        <SelectionPicker
          data={[
            { title: t('landing:platformPlans'), value: 0 },
            { title: t('landing:servicePlans'), value: 1 },
          ]}
          selectedItem={[selectedTab]}
          onValueChange={onTabChange}
          itemWidth={isMobile ? 140 : 175}
          containerStyles={styles.pickerContainer}
          primary={false}
        />
      </View>

      <Typography variant="text" size="regular" fontWeight="regular" style={styles.plansHeaderTitle}>
        {isServicePlans ? t('landing:servicePlansHeader') : t('landing:platformPlansHeader')}
      </Typography>
      {isServicePlans ? <ServicePlansSection /> : <PlatformPlanSection />}
      <Typography
        variant="text"
        size="small"
        fontWeight="semiBold"
        onPress={navigateToMembershipPlans}
        style={[styles.featureComparison, (onlyTablet || isMobile) && styles.featureComparisionTab]}
      >
        {t('landing:featureComparison')}
      </Typography>
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
    width: 140,
  },
  titleStyle: {
    marginVertical: 12,
    marginHorizontal: 30,
  },
  plansHeaderTitle: {
    textAlign: 'center',
    marginBottom: 50,
    paddingHorizontal: 24,
    color: theme.colors.darkTint3,
  },
  pickerContainer: {
    height: 54,
  },
  selectionPicker: { justifyContent: 'center', alignItems: 'center', marginBottom: 50 },
  featureComparison: {
    textAlign: 'center',
    marginBottom: 120,
    color: theme.colors.primaryColor,
  },
  featureComparisionTab: {
    marginBottom: 60,
  },
});
