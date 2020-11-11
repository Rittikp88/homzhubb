import React from 'react';
import SalePropertyFooter from './SalePropertyFooter';
import NewPropertyFooter from './NewPropertyFooter';
import ReadyPropertyFooter from './ReadyPropertyFooter';

// TODO (LAKSHIT) - change dummy data with actual api data
interface IProps {
  investType: string;
}

const InvestmentFooter = (props: IProps): React.ReactElement => {
  const { investType } = props;
  console.log('Type => ', investType);
  switch (investType) {
    case 'New':
      return <NewPropertyFooter />;
    case 'Ready':
      return <ReadyPropertyFooter />;
    case 'Sale':
      return <SalePropertyFooter />;
    default:
      return <NewPropertyFooter />;
  }
};

export default InvestmentFooter;
