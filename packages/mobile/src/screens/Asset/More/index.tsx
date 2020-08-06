import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export class More extends React.PureComponent<{}, {}> {
  public render = (): React.ReactElement => {
    return (
      <View style={styles.screen}>
        <Text>More Screen</Text>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
