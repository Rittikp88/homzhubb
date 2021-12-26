import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';
import { AssetSummary } from '@homzhub/mobile/src/components/molecules/AssetSummary';
import { AssetMetricsList } from '@homzhub/mobile/src/components/organisms/AssetMetricsList';
import HotPropertiesTab from '@homzhub/ffm/src/screens/Dashboard/HotProperties/HotPropertiesTab';
import { ScreenKeys } from '@homzhub/ffm/src/navigation/interfaces';

const Dashboard = (): React.ReactElement => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const onViewAllProperties = (): void => {
    navigate(ScreenKeys.HotProperties);
  };

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
    <GradientScreen
      isUserHeader
      isScrollable
      screenTitle={t('assetDashboard:dashboard')}
      containerStyle={styles.container}
    >
      {renderAssetMetricsAndUpdates()}
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
