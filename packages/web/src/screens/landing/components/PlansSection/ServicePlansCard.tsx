import React, { FC } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useUp } from '@homzhub/common/src/utils/MediaQueryUtils';
import CardWithIcon from '@homzhub/web/src/components/atoms/CardWithIcon';
import { ServicePlans } from '@homzhub/common/src/domain/models/ServicePlans';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

interface IProps {
  servicePlansList: ServicePlans[];
  servicePlansCardStyle: ViewStyle;
  cardStyle?: ViewStyle;
}

const ServicePlansCard: FC<IProps> = (props: IProps) => {
  const { servicePlansList, servicePlansCardStyle, cardStyle = {} } = props;
  const isDesktop = useUp(deviceBreakpoint.DESKTOP);

  return (
    <View style={servicePlansCardStyle}>
      {servicePlansList.map((plans) => (
        <CardWithIcon
          cardImage={plans.attachment.link}
          cardTitle={plans.label}
          cardDescription={plans.description}
          key={`service-plan-${plans.id}`}
          cardStyle={[isDesktop ? styles.servicePlansCard : styles.servicePlansCardMobile, cardStyle]}
        />
      ))}
    </View>
  );
};
export default ServicePlansCard;

const styles = StyleSheet.create({
  servicePlansCard: {
    width: '20%',
  },
  servicePlansCardMobile: {
    width: 270,
  },
});
