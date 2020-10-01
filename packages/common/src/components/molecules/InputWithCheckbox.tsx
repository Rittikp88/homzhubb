import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { RNCheckbox } from '@homzhub/common/src/components';

export interface IProps {
  onChange: (isSelected: boolean, text: string) => void;
  selected?: boolean;
  textValue?: string;
}

export const InputWithCheckbox = (props: IProps): React.ReactElement => {
  const { onChange, selected = false, textValue = '' } = props;
  const [isSelected, setIsSelected] = useState(selected);
  const [text, setText] = useState(textValue);

  useEffect(() => {
    onChange(isSelected, text);
  }, [isSelected, text]);

  const onCheckboxToggle = (): void => {
    setIsSelected((prev) => !prev);
  };

  return (
    <View style={styles.inputWithCheckbox}>
      <RNCheckbox containerStyle={styles.checkboxStyle} onToggle={onCheckboxToggle} selected={isSelected} />
      <TextInput
        value={text}
        editable={isSelected}
        style={styles.inputStyle}
        onChangeText={(value: string): void => {
          setText(value);
        }}
        underlineColorAndroid="transparent"
      />
    </View>
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
