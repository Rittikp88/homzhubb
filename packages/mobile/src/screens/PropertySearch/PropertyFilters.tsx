import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

class PropertyFilters extends React.PureComponent<{}, {}> {
  public render = (): React.ReactElement => {
    return (
      <View style={styles.screen}>
        <Text>Property Filters</Text>
      </View>
    );
  };
}

export default PropertyFilters;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
