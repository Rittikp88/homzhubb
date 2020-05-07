import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Welcome } from '@homzhub/common/src/components';

export const App = (): React.ReactElement => (
  <SafeAreaView>
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
      <Welcome />
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
});
