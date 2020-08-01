import React from 'react';
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  label: string;
  placeholder: string;
  isOptional?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  onMessageChange?: (text: string) => void;
}

export const TextArea = (props: IProps): React.ReactElement => {
  const { label, placeholder, isOptional, containerStyle = {}, onMessageChange } = props;
  return (
    <View style={containerStyle}>
      <View style={styles.labelView}>
        <Label type="large" style={styles.labelStyle}>
          {label}
        </Label>
        {isOptional && (
          <Label type="regular" style={{ color: theme.colors.darkTint3 }}>
            Optional
          </Label>
        )}
      </View>
      <View style={styles.textAreaContainer}>
        <TextInput
          style={styles.textArea}
          placeholder={placeholder}
          maxLength={250}
          multiline
          onChangeText={onMessageChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelStyle: {
    color: theme.colors.darkTint3,
  },
  labelView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  textAreaContainer: {
    borderColor: theme.colors.disabled,
    borderWidth: 1,
    padding: 5,
  },
  textArea: {
    height: 150,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
});
