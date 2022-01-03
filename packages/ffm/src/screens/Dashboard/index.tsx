import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle, View, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { FFMRepository } from '@homzhub/common/src/domain/repositories/FFMRepository';
import { FFMSelector } from '@homzhub/common/src/modules/ffm/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import { AssetSummary } from '@homzhub/mobile/src/components/molecules/AssetSummary';
import { AssetMetricsList } from '@homzhub/mobile/src/components/organisms/AssetMetricsList';
import HotPropertiesTab from '@homzhub/ffm/src/screens/Dashboard/HotProperties/HotPropertiesTab';
import { FFMMetrics } from '@homzhub/common/src/domain/models/FFMMetrics';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

const Dashboard = (): React.ReactElement => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { hotProperties } = useSelector(FFMSelector.getFFMLoaders);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<FFMMetrics | null>(null);

  useFocusEffect(
    useCallback(() => {
      getMetrics();
    }, [])
  );

  const getMetrics = (): void => {
    setLoading(true);
    FFMRepository.getManagementTab()
      .then((res) => {
        setMetrics(res);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      });
  };

  const onViewAllProperties = (): void => {
    navigate(ScreenKeys.HotProperties);
  };

  const navigateToRequests = (): void => {
    navigate(ScreenKeys.Requests);
  };

  const renderAssetMetricsAndUpdates = (data: FFMMetrics): React.ReactElement => {
    const { jobs, notifications, tickets } = data.updates;
    return (
      <>
        <AssetMetricsList
          title={`${0}`}
          subTitleText={t('properties')}
          data={data.miscellaneous}
          onMetricsClicked={onViewAllProperties}
        />
        <AssetSummary
          isFFM
          jobs={jobs.count}
          serviceTickets={tickets.count}
          notification={notifications.count}
          containerStyle={styles.assetCards()}
          onPressServiceTickets={navigateToRequests}
        />
      </>
    );
  };
  return (
    <GradientScreen
      isUserHeader
      isScrollable
      loading={hotProperties || loading}
      screenTitle={t('assetDashboard:dashboard')}
      containerStyle={styles.container}
    >
      {metrics && renderAssetMetricsAndUpdates(metrics)}
      <View style={styles.flexOne}>
        {/* @ts-ignore */}
        <View style={styles.headerStyle}>
          <Text type="small" textType="semiBold">
            {t('property:hotProperties')}
          </Text>
          <TouchableOpacity onPress={onViewAllProperties}>
            <Text type="small" style={styles.view}>
              {t('assetDashboard:viewAll')}
            </Text>
          </TouchableOpacity>
        </View>
        <HotPropertiesTab isOnDashboard />
      </View>
    </GradientScreen>
  );
};

export default Dashboard;
const styles = {
  container: {
    backgroundColor: theme.colors.background,
    padding: 0,
  },
  flexOne: {
    flex: 1,
  },
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    marginHorizontal: 10,
  },
  view: {
    color: theme.colors.primaryColor,
  },
  assetCards: (): StyleProp<ViewStyle> => ({
    marginVertical: 12,
    flex: 0,
    borderWidth: 0.5,
    borderColor: theme.colors.disabled,
  }),
  evenItem: (): StyleProp<ViewStyle> => ({
    marginEnd: 17,
  }),
};
