import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { theme } from '@homzhub/common/src/styles/theme';
import { AssetActions } from '@homzhub/common/src/modules/asset/actions';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { SearchActions } from '@homzhub/common/src/modules/search/actions';
import PropertyDetail from '@homzhub/mobile/src/components/organisms/PropertyDetail';
import { AssetStatusInfo } from '@homzhub/common/src/domain/models/AssetStatusInfo';

interface IProps {
  assetStatusInfo: AssetStatusInfo | null;
}

const DetailTab = (props: IProps): React.ReactElement => {
  const { assetStatusInfo } = props;
  const dispatch = useDispatch();
  const detail = useSelector(AssetSelectors.getAsset);

  useEffect(() => {
    if (assetStatusInfo && (assetStatusInfo.leaseListingId || assetStatusInfo.saleListingId)) {
      const { leaseListingId, saleListingId } = assetStatusInfo;
      dispatch(SearchActions.setFilter({ asset_transaction_type: leaseListingId && leaseListingId > 0 ? 0 : 1 }));
      dispatch(AssetActions.getAsset({ propertyTermId: leaseListingId || saleListingId || 0 }));
    }
  }, []);

  return (
    <View style={styles.container}>
      <PropertyDetail detail={detail} isCollapsible={false} />
    </View>
  );
};

export default DetailTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
  },
});
