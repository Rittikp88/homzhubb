import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

const Portfolio: FC = () => {
  return (
    <View style={styles.container}>
      <View> Portfolio </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Portfolio;
