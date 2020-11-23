import React from 'react';
import { PropertyInvestment } from '@homzhub/common/src/domain/models/PropertyInvestment';
import SalePropertyFooter from '@homzhub/web/src/screens/dashboard/components/SalePropertyFooter';
import NewPropertyFooter from '@homzhub/web/src/screens/dashboard/components/NewPropertyFooter';
import ReadyPropertyFooter from '@homzhub/web/src/screens/dashboard/components/ReadyPropertyFooter';

// TODO (LAKSHIT) - change dummy data with actual api data
interface IProps {
  investmentData: PropertyInvestment;
}

const InvestmentFooter = (props: IProps): React.ReactElement => {
  const { investmentData } = props;
  const { investmentStatus } = investmentData;
  switch (investmentStatus) {
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
