import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import { AssetFilter } from '@homzhub/common/src/domain/models/AssetFilter';

interface IPortfolioFilterProps {
  filterData: AssetFilter[];
}
type IProps = IPortfolioFilterProps;
const PortfolioFilter: React.FC<IProps> = (props: IProps) => {
  const data = [
    {
      title: 'Select Country',
    },
    {
      title: 'Select Property',
    },
    {
      title: 'Type',
    },
    {
      title: 'Status',
    },
  ];

  return (
    <View style={styles.filterSection}>
      <View style={styles.filterContainer}>
        <Typography size="small" fontWeight="semiBold" style={styles.filterText}>
          Select Country
        </Typography>
        <Icon name={icons.downArrow} size={18} style={styles.icon} />
      </View>
      <View style={styles.filterContainer}>
        <Typography size="small" fontWeight="semiBold" style={styles.filterText}>
          Select Property
        </Typography>
        <Icon name={icons.downArrow} size={18} style={styles.icon} />
      </View>
      <View style={styles.filterContainer}>
        <Typography size="small" fontWeight="semiBold" style={styles.filterText}>
          Type
        </Typography>
        <Icon name={icons.downArrow} size={18} style={styles.icon} />
      </View>
      <View style={styles.filterContainer}>
        <Typography size="small" fontWeight="semiBold" style={styles.filterText}>
          Status
        </Typography>
        <Icon name={icons.downArrow} size={18} style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    marginVertical: '2%',
    flexDirection: 'row',
  },
  filterContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    marginEnd: 12,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    marginHorizontal: 12,
    marginVertical: 6,
    color: theme.colors.primaryColor,
  },
  icon: {
    marginEnd: 12,
    color: theme.colors.primaryColor, 
  },
});
export default PortfolioFilter;
