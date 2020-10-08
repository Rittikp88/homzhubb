import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import SiteVisitTab from '@homzhub/mobile/src/components/organisms/SiteVisitTab';

// TODO: Is this required
const PropertyVisits = (): React.ReactElement => {
  return (
    <View style={styles.container}>
      <SiteVisitTab />
    </View>
  );
};

export default PropertyVisits;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
  },
});
