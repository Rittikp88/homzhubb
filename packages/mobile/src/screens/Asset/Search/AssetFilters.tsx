import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

class AssetFilters extends React.PureComponent<{}, {}> {
  public render = (): React.ReactElement => {
    return (
      <View style={styles.screen}>
        <Text>Asset Advanced Filters</Text>
      </View>
    );
  };
}

export default AssetFilters;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
