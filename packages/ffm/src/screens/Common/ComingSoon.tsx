import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@homzhub/common/src/components/atoms/Text';

const ComingSoon = (): React.ReactElement => {
  return (
    <View style={styles.container}>
      <Text>Coming Soon</Text>
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

export default ComingSoon;
