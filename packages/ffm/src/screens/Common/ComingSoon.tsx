import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import GradientScreen from '@homzhub/ffm/src/components/HOC/GradientScreen';

const ComingSoon = (): React.ReactElement => {
  return (
    <GradientScreen>
      <View style={styles.container}>
        <Text>Coming Soon</Text>
      </View>
    </GradientScreen>
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
