import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components';

class PropertySearch extends React.PureComponent<{}, {}> {
  public render(): React.ReactElement {
    return (
      <View style={styles.container}>
        <Text type="regular" textType="regular">
          Welcome to Property Search!
        </Text>
      </View>
    );
  }
}

export default PropertySearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
