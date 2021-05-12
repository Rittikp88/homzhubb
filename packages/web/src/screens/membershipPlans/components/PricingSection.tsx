import React, { FC, ReactElement, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { NavigationUtils } from '@homzhub/web/src/utils/NavigationUtils';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { RouteNames } from '@homzhub/web/src/router/RouteNames';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { PlatformPlans } from '@homzhub/common/src/domain/models/PlatformPlan';
import { ServiceBundleItems } from '@homzhub/common/src/domain/models/ServiceBundleItems';
import '@homzhub/web/src/screens/membershipPlans/components/PricingSection.scss';

const PricingSection: FC = () => {
  const [servicePlan, setServicePlan] = useState<PlatformPlans[]>([]);
  const [featureList, setFeatureList] = useState<ServiceBundleItems[]>([]);
  const { t } = useTranslation();
  const history = useHistory();

  useEffect(() => {
    getServicePlans();
  }, []);

  const getServicePlans = async (): Promise<void> => {
    try {
      const response: PlatformPlans[] = await ServiceRepository.getPlatformPlans();
      getFeatureList(response);
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };

  const getFeatureList = (response: PlatformPlans[]): void => {
    setServicePlan(response.sort((a, b) => Number(a.id) - Number(b.id)));
    const data = response.filter((plan) => plan.name === 'PRO');
    setFeatureList(data[0].servicePlanBundle);
  };

  const availableFeature = (label: ServiceBundleItems, servicePlans: PlatformPlans): ReactElement => {
    const data = servicePlans.servicePlanBundle.filter((feature) => feature.name === label.name);
    if (data.length !== 0) {
      return (
        <td className="header-cards">
          <Icon name={icons.checkFilled} size={16} color={theme.colors.green} />
        </td>
      );
    }
    return (
      <td className="header-cards">
        <Icon name={icons.close} size={16} color={theme.colors.danger} />
      </td>
    );
  };

  const firstLetterUpperCase = (theString: string): string => {
    return theString?.charAt(0).toUpperCase() + theString?.slice(1) || ' ';
  };

  const availablePrice = (servicePlans: PlatformPlans): ReactElement => {
    const price = servicePlans.servicePlanPricing.filter((item) => item.currency.currencyCode === 'USD');
    if (servicePlans.name === 'FREEDOM')
      return (
        <td className="header-cards">
          <Typography variant="text" size="small" fontWeight="semiBold">
            {t('common:free')}
          </Typography>
        </td>
      );
    if (servicePlans.name === 'PRO' || servicePlans.name === 'PREMIUM')
      return (
        <td className="header-cards">
          <Typography variant="text" size="small" fontWeight="semiBold">
            {price[0].currency.currencySymbol}
            {price[0].actualPrice}
          </Typography>
          <Typography variant="text" size="small">
            {t('common:perYear')}
          </Typography>
        </td>
      );
    return (
      <td className="header-cards">
        <Typography variant="text" size="small" fontWeight="semiBold" style={styles.primary}>
          {t('common:contactUs')}
        </Typography>
      </td>
    );
  };

  const extractString = (stringData: string): ReactElement | null => {
    const regExp = /\(([^)]+)\)/;
    const subHeading = regExp.exec(stringData);
    if (subHeading !== null) {
      return (
        <p className="feature-text">
          <Typography variant="label" size="large" style={styles.subTextColor}>
            {firstLetterUpperCase(t(subHeading[1]))}
          </Typography>
        </p>
      );
    }
    return null;
  };
  const navigationToSignup = (): void => {
    NavigationUtils.navigate(history, {
      path: RouteNames.publicRoutes.SIGNUP,
    });
  };
  return (
    <View style={styles.container}>
      <div className="header">
        <table>
          <tr className="header-row">
            <td className="image-cell">
              <img src={require('@homzhub/common/src/assets/images/PricingTag.svg')} alt="headerImage" />
            </td>

            {servicePlan?.map((item: PlatformPlans) => (
              <td className="header-cards" key={item.id}>
                <div className="card-container">
                  <p>
                    <Typography variant="text" size="small" fontWeight="semiBold">
                      {t(item.label)}
                    </Typography>
                  </p>
                  <p className="card-description">
                    <Typography variant="label" size="large" style={styles.subTextColor}>
                      {t(item.description)}
                    </Typography>
                  </p>
                  <Button
                    type="primary"
                    title={
                      item.name !== 'FREEDOM'
                        ? item.name === 'PRO' || item.name === 'PREMIUM'
                          ? t('common:getStarted')
                          : t('common:contactSales')
                        : t('common:freeSignUp')
                    }
                    titleStyle={styles.buttonTitleStyle}
                    onPress={navigationToSignup}
                  />
                </div>
              </td>
            ))}
          </tr>

          <tr>
            <td className="header-cell" colSpan={3}>
              <Typography variant="text" size="small" fontWeight="semiBold">
                {t('landing:pricing')}
              </Typography>
              <Typography variant="label" size="large" style={[styles.subTextColor, styles.space]}>
                {t('offers:localTaxHeading')}
              </Typography>
            </td>
          </tr>
          <tr className="header-row">
            <td className="header-cell">
              <Typography variant="text" size="small">
                {t('offers:pricingCost')}
              </Typography>
            </td>
            {servicePlan?.map((item: PlatformPlans) => availablePrice(item))}
          </tr>

          <tr>
            <td className="header-cell">
              <Typography variant="text" size="small" fontWeight="semiBold">
                {t('common:features')}
              </Typography>
            </td>
          </tr>
          {featureList.map((item: ServiceBundleItems) => (
            <tr className="header-row" key={item.id}>
              <td className="header-cell">
                <p className="feature">
                  <Typography variant="text" size="small">
                    {t(item.label.split('(')[0])}
                  </Typography>
                </p>
                {extractString(item.label)}
              </td>

              {servicePlan?.map((data: PlatformPlans) => availableFeature(item, data))}
            </tr>
          ))}
        </table>
      </div>
    </View>
  );
};
export default PricingSection;
const styles = StyleSheet.create({
  container: {
    width: '91vw',
    backgroundColor: theme.colors.background,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.08,
    shadowOffset: {
      height: 42,
      width: 0,
    },
    shadowRadius: 120,
    marginHorizontal: 'auto',
    marginBottom: '10%',
  },
  subTextColor: {
    color: theme.colors.darkTint3,
  },
  space: {
    paddingLeft: 8,
  },
  buttonTitleStyle: {
    marginHorizontal: 10,
  },
  primary: {
    color: theme.colors.primaryColor,
  },
});
