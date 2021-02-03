import React, { useState, useEffect, FC } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import ServicePlansCard from '@homzhub/web/src/screens/landing/components/PlansSection/ServicePlansCard';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { ServicePlans } from '@homzhub/common/src/domain/models/ServicePlans';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const ServicePlansSection: FC = () => {
  const [servicePlansList, setServicePlansList] = useState([] as ServicePlans[]);
  useEffect(() => {
    ServiceRepository.getServicePlans()
      .then((response) => {
        setServicePlansList(response);
      })
      .catch((e) => {
        const error = ErrorUtils.getErrorMessage(e.details);
        AlertHelper.error({ message: error });
      });
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
