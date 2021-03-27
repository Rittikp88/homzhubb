import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { theme } from '@homzhub/common/src/styles/theme';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import PropertyDetail from '@homzhub/mobile/src/components/organisms/PropertyDetail';

const DetailTab = (): React.ReactElement => {
  const detail = useSelector(AssetSelectors.getAsset);

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
