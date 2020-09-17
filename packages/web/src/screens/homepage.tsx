import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components';

class App extends React.PureComponent {
  public render(): React.ReactNode {
    return (
      <View style={styles.container}>
        <Text type="regular" textType="bold">
          Hello
        </Text>
        <Text type="large" textType="semiBold">
          World
        </Text>
      </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
