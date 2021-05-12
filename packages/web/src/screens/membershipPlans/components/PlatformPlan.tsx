import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import PlatformPlansTab from '@homzhub/web/src/screens/membershipPlans/components/PlatformPlansTab';
import PlatformPlansWeb from '@homzhub/web/src/screens/membershipPlans/components/PlatformPlansWeb';
import { PlatformPlans } from '@homzhub/common/src/domain/models/PlatformPlan';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const PlatformPlan: FC = () => {
  const [platformPlansData, setPlatformPlansData] = useState<PlatformPlans[]>([]);

  useEffect(() => {
    getServicePlans();
  }, []);

  const getServicePlans = async (): Promise<void> => {
    try {
      const response: PlatformPlans[] = await ServiceRepository.getPlatformPlans();
      setPlatformPlansData(response);
    } catch (e) {
      const error = ErrorUtils.getErrorMessage(e.details);
      AlertHelper.error({ message: error });
    }
  };
  const isLaptop = useUp(deviceBreakpoint.LAPTOP);
  return (
    <View style={styles.container}>
      {isLaptop && platformPlansData.length ? (
        <PlatformPlansWeb platformPlansData={platformPlansData} />
      ) : (
        <PlatformPlansTab />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: '5%',
  },
});

export default PlatformPlan;
