import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import { AssetSummary } from '@homzhub/mobile/src/components/molecules/AssetSummary';
import { AssetMetricsList } from '@homzhub/mobile/src/components/organisms/AssetMetricsList';

const Dashboard = (): React.ReactElement => {
  const { t } = useTranslation();

  const renderAssetMetricsAndUpdates = (): React.ReactElement => {
    return (
      <>
        <AssetMetricsList
          title={`${0}`}
          subTitleText={t('properties')}
          onMetricsClicked={(): void => {}}
          data={[{ name: t('properties'), count: 0, colorCode: theme.colors.incomeGreen }]}
        />
        <AssetSummary
          isFFM
          jobs={0}
          notification={0}
          serviceTickets={0}
          onPressMessages={(): void => {}}
          containerStyle={styles.assetCards()}
          onPressNotification={(): void => {}}
          onPressServiceTickets={(): void => {}}
        />
      </>
    );
  };
  return (
    <GradientScreen isUserHeader screenTitle={t('assetDashboard:dashboard')} containerStyle={styles.container}>
      {renderAssetMetricsAndUpdates()}
    </GradientScreen>
  );
};

export default Dashboard;
const styles = {
  container: {
    backgroundColor: theme.colors.background,
    padding: 0,
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
