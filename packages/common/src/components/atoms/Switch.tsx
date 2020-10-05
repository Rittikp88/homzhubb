import React from 'react';
import { Switch, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';

interface ISwitchOptions {
  selected: boolean;
  onToggle: () => void;
}

export const RNSwitch = (props: ISwitchOptions): React.ReactElement => {
  const { selected, onToggle } = props;
  return (
    <Switch
      style={styles.switch}
      trackColor={{ false: theme.colors.disabled, true: theme.colors.primaryColor }}
      thumbColor={theme.colors.white}
      onValueChange={onToggle}
      value={selected}
    />
  );
};

const styles = StyleSheet.create({
  switch: {
    alignSelf: 'flex-end',
    transform: [{ scaleX: 0.7 }, { scaleY: 0.65 }],
  },
});
