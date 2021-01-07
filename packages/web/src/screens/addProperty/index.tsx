import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import MapsPOC from '@homzhub/web/src/screens/addProperty/components/GoogleMapView';
import PropertyDetailsForm from '@homzhub/web/src/screens/addProperty/components/PropertyDetailsForm';

const AddProperty: FC = () => {
  return (
    <View style={styles.container}>
      <MapsPOC />
      <PropertyDetailsForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
});
export default AddProperty;
