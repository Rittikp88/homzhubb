import React, { FC ,useState, useEffect} from 'react';
import { StyleSheet, View } from 'react-native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';

import PortfolioHeader from '@homzhub/web/src/screens/portfolio/components/PortfolioHeader';
import PortfolioCardGroup from '@homzhub/web/src/screens/portfolio/components/PortfolioCardGroup';
import PortfolioFilter from '@homzhub/web/src/screens/portfolio/components/PortfolioFilter';
import {PortfolioRepository} from '@homzhub/common/src/domain/repositories/PortfolioRepository';
import {AssetFilter} from '@homzhub/common/src/domain/models/AssetFilter';

const Portfolio: FC = () => {

  const [statusfilters, setStatusFilters] = useState<AssetFilter[]>([]);
  useEffect(() => {
    PortfolioRepository.getAssetFilters()
      .then((response) => {
        console.log(response)
        setStatusFilters(response);
      })
      .catch((e) => {
        const error = ErrorUtils.getErrorMessage(e.details);
        AlertHelper.error({ message: error });
      });
  }, []);
  return (
    <View style={styles.container}>
      <PortfolioHeader />
      <PortfolioFilter filterData={statusfilters}/>
      <PortfolioCardGroup />
    </View>
  );
 
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    
  },
});
export default Portfolio;
