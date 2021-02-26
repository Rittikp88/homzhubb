import React from 'react';
import {View} from 'react-native';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';

const PortfolioHeader: React.FC = () => {
  return(
    <View style ={{height:140,  backgroundColor:'white'}}>
    <Typography size="large">Header Here</Typography>
  </View>
  )
};

export default PortfolioHeader;
