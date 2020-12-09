import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import UserSubscriptionPlan from '@homzhub/common/src/components/molecules/UserSubscriptionPlan';
import InvestmentsCarousel from '@homzhub/web/src/screens/dashboard/components/InvestmentsCaraousel';
import MarketTrendsCarousel from '@homzhub/web/src/screens/dashboard/components/MarketTrendsCarousel';
import PropertyNotifications from '@homzhub/web/src/screens/dashboard/components/PropertyNotifications';
import PropertyOverview from '@homzhub/web/src/screens/dashboard/components/PropertyOverview';
import PropertyVisualsEstimates from '@homzhub/web/src/screens/dashboard/components/PropertyVisualEstimates';
import VacantProperties from '@homzhub/web/src/screens/dashboard/components/VacantProperties';
import { PendingPropertiesCard } from '@homzhub/web/src/components';
import { Asset, PropertyStatus } from '@homzhub/common/src/domain/models/Asset';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  investmentDataArray: Asset[];
}

const Dashboard: FC<IProps> = (props: IProps) => {
  const isMobile = useUp(deviceBreakpoint.MOBILE);
  const { investmentDataArray } = props;
  const [pendingProperty, setPendingProperty] = useState({} as Asset[]);
  useEffect(() => {
    getPendingProperties((response) => setPendingProperty(response));
  }, []);
  return (
    <View style={styles.container}>
      <PropertyOverview />
      <PropertyNotifications />
      <PropertyVisualsEstimates />
      {isMobile ? (
        <View style={[styles.wrapper, isMobile && styles.row]}>
          {pendingProperty.length > 0 && <PendingPropertiesCard data={pendingProperty} />}
          <UserSubscriptionPlan onApiFailure={FunctionUtils.noop} />
        </View>
      ) : (
        <>
          {pendingProperty.length > 0 && <PendingPropertiesCard data={pendingProperty} />}
          <UserSubscriptionPlan onApiFailure={FunctionUtils.noop} />
        </>
      )}
      <VacantProperties />
      <InvestmentsCarousel investmentData={investmentDataArray} />
      <MarketTrendsCarousel />
    </View>
  );
};

const getPendingProperties = async (callback: (response: Asset[]) => void): Promise<void> => {
  try {
    const response: Asset[] = await AssetRepository.getPropertiesByStatus(PropertyStatus.PENDING);
    callback(response);
  } catch (e) {
    // todo handle error here
    // AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
  }
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
});
