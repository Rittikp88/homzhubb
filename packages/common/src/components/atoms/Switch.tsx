import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';

interface ISwitchOptions {
  selected: boolean;
  onToggle: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
}

const RNSwitch = (props: ISwitchOptions): React.ReactElement => {
  const { selected, containerStyle = {}, iconSize = 22, onToggle } = props;
  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onToggle}>
      <Icon name={selected ? icons.toggleOn : icons.toggleOff} size={iconSize} />
    </TouchableOpacity>
  );
};

export { RNSwitch };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
