import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components';

export const GettingStarted = (): React.ReactElement => {
  return (
    <View style={styles.container}>
      <Text type="small" textType="bold">
        Getting Started
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...theme.globalStyles.center,
    flexDirection: 'row',
  },
});
