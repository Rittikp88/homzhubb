import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Welcome } from '@homzhub/common/src/components';

const App = (): React.ReactElement => (
  <>
    <StatusBar barStyle="dark-content" />
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <Welcome />
      </ScrollView>
    </SafeAreaView>
  </>
);

const white = 'white';
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: white,
  },
});

export default App;
