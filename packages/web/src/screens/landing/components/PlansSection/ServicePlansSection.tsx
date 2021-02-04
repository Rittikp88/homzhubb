import React, { useState, useEffect, FC } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { theme } from '@homzhub/common/src/styles/theme';
import ServicePlansCard from '@homzhub/web/src/screens/landing/components/PlansSection/ServicePlansCard';
import { ServicePlans } from '@homzhub/common/src/domain/models/ServicePlans';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { ServicePlansData } from '@homzhub/common/src/mocks/ServicePlansMockData';

const ServicePlansSection: FC = () => {
  const [servicePlansList, setServicePlansList] = useState([] as ServicePlans[]);
  // TODO Get this data from API.
  useEffect(() => {
    setServicePlansList(ObjectMapper.deserializeArray(ServicePlans, ServicePlansData));
  }, []);
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);

  return (
    <>
      {!isDesktop ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.servicePlansContainer}>
          <ServicePlansCard
            servicePlansCardStyle={styles.servicePlansCardsContainer}
            servicePlansList={servicePlansList}
          />
        </ScrollView>
      ) : (
        <ServicePlansCard
          servicePlansCardStyle={styles.servicePlansContainerDesktop}
          servicePlansList={servicePlansList}
        />
      )}
    </>
  );
};
export default ServicePlansSection;

const styles = StyleSheet.create({
  servicePlansContainer: {
    backgroundColor: theme.colors.background,
    marginBottom: 120,
  },
  servicePlansCardsContainer: {
    flexDirection: 'row',
  },
  servicePlansContainerDesktop: {
    flexDirection: 'row',
    marginHorizontal: 'auto',
    flexWrap: 'wrap',
    width: '90%',
  },
});
