import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import InvestmentsCard from '@homzhub/web/src/screens/dashboard/components/InvestmentsCard';
import { InvestmentMockData } from './InvestmentMockDetails';
// import { PropertyInvestment } from '@homzhub/common/src/domain/models/PropertyInvestment';
// TODO (LAKSHIT) - change dummy data with actual api data
interface IProps {
  // investmentData: PropertyInvestment[];
  investmentData: any[];
}
const InvestmentsCarousel = (props: IProps): React.ReactElement => {
  // const{ investmentData } = props;
  const investmentDataArray = InvestmentMockData;
  return (
    <View style={styles.carouselContainer}>
      <View style={styles.titleContainer}>
        <Icon name={icons.increase} color={theme.colors.dark} size={24} style={styles.icon} />
        <Text type="regular" textType="semiBold" style={styles.title}>
          Investments
        </Text>
      </View>
      <MultiCarousel>
        {/* {investmentDataArray.map((item)=>(<InvestmentsCard investmentData={item} />)) } */}
        {investmentDataArray.map((item) => (
          <InvestmentsCard key={item.id} investmentData={item} />
        ))}
      </MultiCarousel>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    backgroundColor: theme.colors.background,
    marginVertical: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.dark,
  },
  icon: {
    margin: 12,
  },
});

export default InvestmentsCarousel;
