import React from 'react';
import { GestureResponderEvent, StyleSheet, View } from 'react-native';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { theme } from '@homzhub/common/src/styles/theme';

export const Splash = (): React.ReactElement => {
  const onPress = (event: GestureResponderEvent): void => {};

  return (
    <View style={styles.container}>
      <Button type="primary" containerStyle={theme.buttonStyle.error} title="Button" onPress={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...theme.globalStyles.center,
    flexDirection: 'row',
    marginHorizontal: theme.layout.screenPadding,
  },
});
