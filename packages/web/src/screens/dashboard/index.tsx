import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AssetRepository } from '@homzhub/common/src/domain/repositories/AssetRepository';
import { DashboardRepository } from '@homzhub/common/src/domain/repositories/DashboardRepository';
import { PortfolioRepository } from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import UserSubscriptionPlan from '@homzhub/common/src/components/molecules/UserSubscriptionPlan';
import InvestmentsCarousel from '@homzhub/web/src/screens/dashboard/components/InvestmentsCaraousel';
import MarketTrendsCarousel from '@homzhub/web/src/screens/dashboard/components/MarketTrendsCarousel';
import PropertyUpdates from '@homzhub/web/src/screens/dashboard/components/PropertyUpdates';
import PropertyOverview from '@homzhub/web/src/screens/dashboard/components/PropertyOverview';
import PropertyVisualsEstimates from '@homzhub/web/src/screens/dashboard/components/PropertyVisualEstimates';
import VacantProperties from '@homzhub/web/src/screens/dashboard/components/VacantProperties';
import { PendingPropertiesCard } from '@homzhub/web/src/components';
import { Asset, PropertyStatus } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { AssetMetrics } from '@homzhub/common/src/domain/models/AssetMetrics';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  investmentDataArray: Asset[];
}

const Dashboard: FC<IProps> = (props: IProps) => {
  const isMobile = useUp(deviceBreakpoint.MOBILE);
  const { investmentDataArray } = props;
  const [pendingProperty, setPendingProperty] = useState({} as Asset[]);
  const [vacantProperty, setVacantProperty] = useState({} as Asset[]);
  const [propertyMetrics, setPropertyMetrics] = useState({} as AssetMetrics);
  useEffect(() => {
    getPendingPropertyDetails((response) => setPendingProperty(response)).then();
    getPropertyMetrics((response) => setPropertyMetrics(response)).then();
    getVacantPropertyDetails((response) => setVacantProperty(response)).then();
  }, []);
  const PendingPropertyAndUserSubscriptionComponent = (): React.ReactElement => (
    <>
      {pendingProperty.length > 0 && <PendingPropertiesCard data={pendingProperty} />}
      <UserSubscriptionPlan onApiFailure={FunctionUtils.noop} />
    </>
  );
  return (
    <View style={styles.container}>
      <PropertyOverview data={propertyMetrics?.assetMetrics?.miscellaneous ?? []} />
      <PropertyUpdates updatesData={propertyMetrics?.updates ?? {}} />
      <PropertyVisualsEstimates />
      {isMobile ? (
        <View style={[styles.wrapper, isMobile && styles.row]}>
          <PendingPropertyAndUserSubscriptionComponent />
        </View>
      ) : (
        <PendingPropertyAndUserSubscriptionComponent />
      )}
      <VacantProperties data={vacantProperty} />
      <InvestmentsCarousel investmentData={investmentDataArray} />
      <MarketTrendsCarousel />
    </View>
  );
};

const getPendingPropertyDetails = async (callback: (response: Asset[]) => void): Promise<void> => {
  try {
    const response: Asset[] = await AssetRepository.getPropertiesByStatus(PropertyStatus.PENDING);
    callback(response);
  } catch (e) {
    // todo handle error here
  }
};

const getPropertyMetrics = async (callback: (response: AssetMetrics) => void): Promise<void> => {
  try {
    const response: AssetMetrics = await DashboardRepository.getAssetMetrics();
    callback(response);
  } catch (e) {
    // todo handle error here
  }
};
const getVacantPropertyDetails = async (callback: (response: Asset[]) => void): Promise<void> => {
  try {
    const response: Asset[] = await PortfolioRepository.getUserAssetDetails(Filters.VACANT);
    callback(response);
  } catch (e) {
    // todo handle error here
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
