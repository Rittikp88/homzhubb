import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { theme } from '@homzhub/common/src/styles/theme';

// TODO: Delete this file once all tab screens are ready
const DummyView = (): React.ReactElement => {
  return (
    <View style={styles.container}>
      <Text type="large">Coming Soon...</Text>
    </View>
  );
};

export default DummyView;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    minHeight: 150,
    paddingVertical: 50,
    backgroundColor: theme.colors.white,
  },
});
