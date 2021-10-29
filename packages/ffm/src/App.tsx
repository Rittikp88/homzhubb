import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';

// Dummy App file to setup FFM module
const App: () => React.ReactNode = () => {
  useEffect(() => {
    RNBootSplash.hide();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Welcome</Text>
      <Text>To</Text>
      <Text>Homzhub Partner Connect</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
