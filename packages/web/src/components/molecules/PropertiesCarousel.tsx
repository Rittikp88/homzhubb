import React from 'react';
import { IFeaturedProperties } from '@homzhub/common/src/domain/repositories/GraphQLRepository';
import MultiCarousel from '@homzhub/web/src/components/molecules/MultiCarousel';
import InvestmentsCard from '@homzhub/web/src/screens/dashboard/components/InvestmentsCard';
import PropertiesCard from '@homzhub/web/src/screens/landing/components/FeaturedProperties/PropertiesCard';
import {
  InvestmentMockData,
  IInvestmentMockData,
} from '@homzhub/web/src/screens/dashboard/components/InvestmentMockDetails';

interface IProps {
  featuredProperties?: IFeaturedProperties[];
}
const PropertiesCarousel: React.FC<IProps> = (props: IProps) => {
  const investmentDataArray = InvestmentMockData;
  const { featuredProperties } = props;
  if (featuredProperties) {
    return (
      <MultiCarousel>
        {featuredProperties.map((item: IFeaturedProperties) => (
          <PropertiesCard key={item.id} investmentData={item} />
        ))}
      </MultiCarousel>
    );
  }

  return (
    <MultiCarousel>
      {investmentDataArray.map((item: IInvestmentMockData) => (
        <InvestmentsCard key={item.id} investmentData={item} />
      ))}
    </MultiCarousel>
  );
};

export default PropertiesCarousel;
