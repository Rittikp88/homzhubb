import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export class Dashboard extends React.PureComponent<{}, {}> {
  public render = (): React.ReactElement => {
    return (
      <View style={styles.screen}>
        <Text>Dashboard Screen</Text>
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
