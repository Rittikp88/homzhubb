import React, { useState, useEffect, FC } from 'react';
import { StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { theme } from '@homzhub/common/src/styles/theme';
import ServicePlansCard from '@homzhub/web/src/screens/landing/components/PlansSection/ServicePlansCard';
import { ServicePlans } from '@homzhub/common/src/domain/models/ServicePlans';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { ServicePlansData } from '@homzhub/common/src/mocks/ServicePlansMockData';

interface IProps {
  cardStyle?: ViewStyle;
  scrollStyle?: ViewStyle;
}
const ServicePlansSection: FC<IProps> = (props: IProps) => {
  const { cardStyle, scrollStyle } = props;
  const [servicePlansList, setServicePlansList] = useState([] as ServicePlans[]);

  useEffect(() => {
    setServicePlansList(ObjectMapper.deserializeArray(ServicePlans, ServicePlansData));
  }, []);
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);

  return (
    <>
      {!isDesktop ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.servicePlansContainer, scrollStyle]}
        >
          <ServicePlansCard
            servicePlansCardStyle={styles.servicePlansCardsContainer}
            servicePlansList={servicePlansList}
          />
        </ScrollView>
      ) : (
        <ServicePlansCard
          servicePlansCardStyle={styles.servicePlansContainerDesktop}
          servicePlansList={servicePlansList}
          cardStyle={cardStyle}
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
    width: '100%',
    paddingVertical: 20,
  },
  servicePlansCardsContainer: {
    flexDirection: 'row',
    marginRight: 24,
  },
  servicePlansContainerDesktop: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    flexWrap: 'wrap',
    width: '90%',
  },
});
