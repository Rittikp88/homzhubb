import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { RNCheckbox } from '@homzhub/common/src/components/atoms/Checkbox';

export interface IProps {
  onChange: (isSelected: boolean, text: string) => void;
  selected?: boolean;
  textValue?: string;
  placeholder?: string;
}

export const InputWithCheckbox = (props: IProps): React.ReactElement => {
  const { onChange, selected = false, textValue = '', placeholder } = props;
  const [isSelected, setIsSelected] = useState(selected);
  const [text, setText] = useState(textValue);

  useEffect(() => {
    onChange(isSelected, text);
  }, [isSelected, text]);

  const onCheckboxToggle = (): void => {
    setIsSelected((prev) => !prev);
  };

  return (
    <TouchableOpacity onPress={onCheckboxToggle} style={styles.inputWithCheckbox}>
      <RNCheckbox containerStyle={styles.checkboxStyle} onToggle={onCheckboxToggle} selected={isSelected} />
      <TextInput
        autoFocus
        value={text}
        editable={isSelected}
        style={styles.inputStyle}
        onChangeText={(value: string): void => {
          setText(value);
        }}
        underlineColorAndroid="transparent"
        placeholder={placeholder}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputWithCheckbox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.colors.disabled,
  },
  checkboxStyle: {
    padding: 10,
  },
  inputStyle: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    paddingLeft: 0,
  },
});
