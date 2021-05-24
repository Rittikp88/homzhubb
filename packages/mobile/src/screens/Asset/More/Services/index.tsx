import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/core';
import { useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { AssetMetricsList, IMetricsData } from '@homzhub/mobile/src/components';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import PropertyServiceCard from '@homzhub/mobile/src/screens/Asset/More/Services/PropertyServiceCard';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const ServicesDashboard = (): React.ReactElement => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const userAsset = useSelector(UserSelector.getUserAssets);
  const [metricsData, setMetricsData] = useState<IMetricsData[]>([]);
  const [totalService, setTotalService] = useState(0);

  useEffect(() => {
    ServiceRepository.getServiceManagementTab()
      .then((res) => {
        const { asset, valueAddedService } = res;
        const data = [
          { name: t('property:propertyAdded'), count: asset.count, colorCode: theme.colors.completed },
          {
            name: t('property:servicePurchased'),
            count: valueAddedService.open.count,
            colorCode: theme.colors.orange,
          },
        ];
        setMetricsData(data);
        setTotalService(valueAddedService.open.count);
      })
      .catch((e) => AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) }));
  }, []);

  const onAddProperty = (): void => {
    navigate(ScreensKeys.PropertyPostStack, { screen: ScreensKeys.AssetLocationSearch });
  };

  const onBuyService = (): void => {
    navigate(ScreensKeys.ValueAddedServices);
  };

  return (
    <UserScreen
      title={t('property:Services')}
      backgroundColor={userAsset.length > 0 ? theme.colors.background : theme.colors.white}
    >
      {userAsset.length <= 0 ? (
        <EmptyState
          title={t('property:noPropertyAdded')}
          containerStyle={styles.emptyContainer}
          buttonProps={{ type: 'secondary', title: t('property:addProperty'), onPress: onAddProperty }}
        />
      ) : (
        <View>
          <AssetMetricsList data={metricsData} numOfElements={2} title={userAsset.length.toString()} />
          <Button
            type="secondary"
            iconSize={20}
            title={t('property:buyNewService')}
            icon={icons.portfolioFilled}
            iconColor={theme.colors.primaryColor}
            textStyle={styles.buttonText}
            containerStyle={styles.newServiceButton}
            onPress={onBuyService}
          />
          {totalService > 0 ? (
            <PropertyServiceCard />
          ) : (
            <EmptyState title={t('property:noServiceAdded')} containerStyle={styles.emptyContainer} />
          )}
        </View>
      )}
    </UserScreen>
  );
};

export default ServicesDashboard;

const styles = StyleSheet.create({
  emptyContainer: {
    paddingVertical: '50%',
    paddingHorizontal: 20,
  },
  newServiceButton: {
    marginVertical: 16,
    borderColor: theme.colors.white,
    flexDirection: 'row-reverse',
  },
  buttonText: {
    marginHorizontal: 10,
  },
});
