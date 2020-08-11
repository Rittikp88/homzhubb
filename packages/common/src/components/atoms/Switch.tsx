import React from 'react';
import { Switch } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';

interface ISwitchOptions {
  selected: boolean;
  onToggle: () => void;
}

const RNSwitch = (props: ISwitchOptions): React.ReactElement => {
  const { selected, onToggle } = props;
  return (
    <Switch
      trackColor={{ false: theme.colors.disabled, true: theme.colors.primaryColor }}
      thumbColor={theme.colors.white}
      onValueChange={onToggle}
      value={selected}
    />
  );
};

export { RNSwitch };
