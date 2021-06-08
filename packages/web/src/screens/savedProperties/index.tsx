import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import EstPortfolioValue from '@homzhub/web/src/components/molecules/EstPortfolioValue';
// TODO -- saved property metrics integration :Shagun
const SavedProperty: FC = () => {
  return (
    <View style={styles.container}>
      <EstPortfolioValue propertiesCount={5} />
    </View>
  );
};
export default SavedProperty;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    justifyContent: 'space-between',
    borderRadius: 4,
    backgroundColor: theme.colors.white,
    width: '93%',
    maxHeight: 140,
  },
});
