import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';

// TODO (LAKSHIT) - change dummy data with actual api data

const SalePropertyFooter = (): React.ReactElement => {
  return <View style={styles.card}>Sale</View>;
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    maxWidth: 322,
    backgroundColor: theme.colors.white,
    marginHorizontal: 4,
    borderTopColor: theme.colors.background,
    borderTopWidth: 1,
    paddingBottom: 20,
    paddingTop: 12,
    paddingHorizontal: 16,
    minHeight: '70px',
  },
});

export default SalePropertyFooter;
