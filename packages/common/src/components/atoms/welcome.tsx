import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const Welcome = (): React.ReactElement => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Homzhub</Text>
    </View>
  );
};

const color = '#20b2aa';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 50,
    color,
  },
});
