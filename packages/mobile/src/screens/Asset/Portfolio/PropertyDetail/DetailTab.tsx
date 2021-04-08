import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { theme } from '@homzhub/common/src/styles/theme';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import PropertyDetail from '@homzhub/mobile/src/components/organisms/PropertyDetail';
import { Asset } from '@homzhub/common/src/domain/models/Asset';

interface IProps {
  propertyData: Asset;
}

const DetailTab = ({ propertyData }: IProps): React.ReactElement => {
  let detail = useSelector(AssetSelectors.getAsset);

  if (!detail) {
    detail = propertyData;
  }

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
