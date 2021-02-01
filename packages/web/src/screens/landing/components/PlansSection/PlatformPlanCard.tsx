import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import OrderedList from '@homzhub/web/src/screens/landing/components/OrderedList';
import { PlatformPlans } from '@homzhub/common/src/domain/models/PlatformPlan';
import { ServiceBundleItems } from '@homzhub/common/src/domain/models/ServiceBundleItems';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IDisclaimer {
  [key: string]: string;
}

const disclaimerSectionText: IDisclaimer = {
  FREEDOM: 'landing:freedom',
  PREMIUM: 'landing:premium',
  PRO: 'landing:pro',
};

interface IProps {
  platformPlans: PlatformPlans;
}

const PlatformPlanCard: FC<IProps> = (props: IProps) => {
  const {
    platformPlans: { name, label, servicePlanBundle, servicePlanPricing },
  } = props;
  const { t } = useTranslation();

  const serviceBundles = servicePlanBundle;

  const sortData = (): void => {
    serviceBundles.sort((a: ServiceBundleItems, b: ServiceBundleItems) => (a.displayOrder > b.displayOrder ? 1 : -1));
  };

  const getFreeSubscriptionPeriod = (): string => {
    const duration = servicePlanPricing[0]?.freeTrialDuration ?? 0;
    return duration === 12 ? '1 year' : `${duration} months`;
  };
  const isMobile = useDown(deviceBreakpoint.TABLET);
  const shouldDisplayPopularBanner = !!(servicePlanPricing && servicePlanPricing[0].banner);
  return (
    <View style={[styles.card, isMobile && styles.cardMobile]}>
      <View style={[styles.freeTierView, !shouldDisplayPopularBanner && styles.noBannerStyle]}>
        <Typography size="large" fontWeight="semiBold" variant="label" style={styles.mostPopularTag}>
          {servicePlanPricing[0].banner}
        </Typography>
      </View>
      <Typography size="large" fontWeight="semiBold" variant="label" style={styles.headerText}>
        {name}
      </Typography>
      <Typography size="small" variant="text" style={styles.headerLabel}>
        {label}
      </Typography>
      {servicePlanPricing && (
        <View style={styles.billingAmount}>
          <Typography size="regular" variant="title" fontWeight="semiBold" style={styles.amount}>
            {servicePlanPricing[0].currency.currencySymbol}
            {servicePlanPricing[0].actualPrice}
          </Typography>
          <Typography size="small" variant="text" style={styles.perYearText}>
            / year
          </Typography>
        </View>
      )}
      {servicePlanPricing && servicePlanPricing[0].freeTrialDuration ? (
        <View style={styles.freeTierView}>
          <Typography size="large" variant="label" fontWeight="semiBold" style={styles.freeTierText}>
            {`Free for ${getFreeSubscriptionPeriod()}`}
          </Typography>
        </View>
      ) : (
        <View style={styles.noBadge} />
      )}
      <Button title="Get Started" type="primary" containerStyle={styles.getStartedButton} />
      <View style={styles.planList}>
        {sortData()}
        {serviceBundles &&
          serviceBundles.map(
            (datum: any, index: number): React.ReactNode => {
              if (index < 5) {
                return <OrderedList label={datum.label} key={index} />;
              }
              return <></>;
            }
          )}
      </View>
      <Typography size="regular" variant="label" style={styles.disclaimerText}>
        {t(disclaimerSectionText[name])}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 28,
    paddingVertical: 20,
    width: 270,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 15,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.08,
    shadowOffset: {
      height: 42,
      width: 0,
    },
    shadowRadius: 120,
  },
  cardMobile: {
    width: 290,
    paddingHorizontal: 28,
    marginHorizontal: 8,
  },
  headerText: {
    alignItems: 'center',
    textAlign: 'center',
    textTransform: 'uppercase',
    paddingBottom: 8,
  },
  headerLabel: {
    textAlign: 'center',
  },
  billingAmount: {
    flexDirection: 'row',
    alignContent: 'center',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  amount: {
    color: theme.colors.dark,
    textAlign: 'center',
  },
  perYearText: {
    paddingTop: 12,
    paddingLeft: 4,
    color: theme.colors.darkTint4,
    textAlign: 'center',
  },
  freeTierView: {
    alignItems: 'center',
    marginBottom: 16,
  },
  freeTierText: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.greenLightOpacity,
    borderRadius: 4,
    textAlign: 'center',
    color: theme.colors.green,
  },
  noBannerStyle: {
    opacity: 0,
    marginBottom: 32,
  },
  mostPopularTag: {
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: theme.colors.maroon,
    borderRadius: 2,
    textAlign: 'center',
    color: theme.colors.white,
    letterSpacing: 0.08,
    textTransform: 'uppercase',
    lineHeight: 16,
  },
  disclaimerText: {
    textAlign: 'center',
    color: theme.colors.darkTint4,
    marginTop: 40,
  },
  noBannerView: {
    height: 30,
    marginBottom: 16,
  },
  noBadge: {
    backgroundColor: theme.colors.green,
    opacity: 0,
    height: 30,
    marginTop: 16,
    width: '100%',
  },
  getStartedButton: { width: 240, marginTop: 12 },
  planList: { marginTop: 12 },
});

export default PlatformPlanCard;
