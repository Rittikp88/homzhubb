import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import PostAssetDetails from '@homzhub/web/src/screens/addProperty/components/AddAssetDetails';

const PropertyDetails: FC = () => {
  return (
    <View style={styles.container}>
      <PostAssetDetails />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
export default PropertyDetails;
