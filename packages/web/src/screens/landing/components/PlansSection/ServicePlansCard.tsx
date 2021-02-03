import React, { FC } from 'react';
import { View, ViewStyle } from 'react-native';
import CardWithIcon from '@homzhub/web/src/components/atoms/CardWithIcon';
import { ServicePlans } from '@homzhub/common/src/domain/models/ServicePlans';

interface IProps {
  servicePlansList: ServicePlans[];
  servicePlansCardStyle: ViewStyle;
}

const ServicePlansCard: FC<IProps> = (props: IProps) => {
  const { servicePlansList, servicePlansCardStyle } = props;
  return (
    <View style={servicePlansCardStyle}>
      {servicePlansList.map((plans) => (
        <CardWithIcon
          cardImage={plans.attachment.link}
          cardTitle={plans.label}
          cardDescription={plans.description}
          key={`service-plan-${plans.id}`}
        />
      ))}
    </View>
  );
};
export default ServicePlansCard;
