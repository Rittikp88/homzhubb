import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import UserSubscriptionPlan from '@homzhub/common/src/components/molecules/UserSubscriptionPlan';
import MarketTrendsCarousel from '@homzhub/web/src/screens/dashboard/components/MarketTrendsCarousel';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import PropertyOverview from '@homzhub/web/src/screens/dashboard/components/PropertyOverview';
import InvestmentsCarousel from '@homzhub/web/src/screens/dashboard/components/InvestmentsCaraousel';
import PropertyNotifications from '@homzhub/web/src/screens/dashboard/components/PropertyNotifications';
import PropertyVisualsEstimates from '@homzhub/web/src/screens/dashboard/components/PropertyVisualEstimates';
import { PendingPropertiesCard } from '@homzhub/web/src/components';
import { PendingProperties } from '@homzhub/common/src/mocks/PendingProperties';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  investmentDataArray: Asset[];
}

const Dashboard: FC<IProps> = (props: IProps) => {
  const dummyData = ObjectMapper.deserializeArray(Asset, PendingProperties);
  const isMobile = useUp(deviceBreakpoint.MOBILE);
  const { investmentDataArray } = props;
  return (
    <View style={styles.container}>
      <PropertyOverview />
      <PropertyNotifications />
      <PropertyVisualsEstimates />
      <View style={[styles.wrapper, isMobile && styles.row]}>
        <PendingPropertiesCard data={dummyData} />
        <UserSubscriptionPlan onApiFailure={FunctionUtils.noop} />
      </View>
      <InvestmentsCarousel investmentData={investmentDataArray} />
      <MarketTrendsCarousel />
    </View>
  );
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
