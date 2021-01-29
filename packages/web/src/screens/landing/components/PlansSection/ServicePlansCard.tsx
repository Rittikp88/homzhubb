import React, { useState, useEffect, FC } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { ServiceRepository } from '@homzhub/common/src/domain/repositories/ServiceRepository';
import { theme } from '@homzhub/common/src/styles/theme';
import CardWithIcon from '@homzhub/web/src/components/atoms/CardWithIcon';
import { ServicePlans } from '@homzhub/common/src/domain/models/ServicePlans';

const ServicePlansCard: FC = () => {
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

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.servicePlansContainer}>
      <View style={styles.servicePlansCardsContainer}>
        {servicePlansList.map((plans) => (
          <CardWithIcon
            cardImage={plans.attachment.link}
            cardTitle={plans.label}
            cardDescription={plans.description}
            key={`service-plan-${plans.id}`}
          />
        ))}
      </View>
    </ScrollView>
  );
};
export default ServicePlansCard;

const styles = StyleSheet.create({
  servicePlansContainer: {
    backgroundColor: theme.colors.background,
  },
  servicePlansCardsContainer: {
    flexDirection: 'row',

    width: '92%',
  },
});
