import React, { FC } from 'react';
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';

interface IProps {
  forwardRef?: React.Ref<TextInput>;
  placeholder: string;
  value: string;
  updateValue: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const SearchField: FC<IProps> = (props: IProps) => {
  const { forwardRef, placeholder, value, containerStyle = {} } = props;
  const onChangeText = (changedValue: string): void => {
    const { updateValue } = props;
    updateValue(changedValue);
  };
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        ref={forwardRef}
        style={styles.textInput}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.darkTint7}
        autoCorrect={false}
        onChangeText={onChangeText}
        testID="textInput"
      />

      <Button
        type="primary"
        icon={icons.search}
        iconSize={20}
        iconColor={theme.colors.darkTint6}
        containerStyle={styles.iconButton}
        testID="btnSearch"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: theme.colors.darkTint10,
    backgroundColor: theme.colors.secondaryColor,
  },
  textInput: {
    flex: 1,
    marginRight: 8,
  },
  iconButton: {
    backgroundColor: theme.colors.secondaryColor,
  },
});
