import React, { useRef } from 'react';
import { StyleProp, StyleSheet, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';

interface IProps {
  label?: string;
  value: string;
  placeholder: string;
  helpText?: string;
  isCountRequired?: boolean;
  onMessageChange?: (text: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  textAreaStyle?: StyleProp<ViewStyle>;
  wordCountLimit?: number;
  inputContainerStyle?: StyleProp<ViewStyle>;
}

export const TextArea = (props: IProps): React.ReactElement => {
  const ref: React.RefObject<TextInput> = useRef(null);
  const {
    label,
    placeholder,
    containerStyle = {},
    inputContainerStyle = {},
    onMessageChange,
    value,
    wordCountLimit = 250,
    helpText,
    textAreaStyle,
    isCountRequired = true,
  } = props;
  const { t } = useTranslation();

  const onPressBox = (): void => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  const wordCount = value.length === 0 ? wordCountLimit : wordCountLimit - value.length;

  return (
    <View style={containerStyle}>
      <View style={styles.labelView}>
        <Label type="large" style={styles.labelStyle}>
          {label}
        </Label>
        {!!helpText && (
          <Label type="regular" style={styles.labelHelper}>
            {helpText}
          </Label>
        )}
      </View>
      <TouchableOpacity style={[styles.textAreaContainer, textAreaStyle]} onPress={onPressBox} activeOpacity={1}>
        <TextInput
          ref={ref}
          autoCorrect={false}
          style={[styles.textArea, inputContainerStyle]}
          placeholder={placeholder}
          maxLength={250}
          multiline
          value={value}
          onChangeText={onMessageChange}
        />
      </TouchableOpacity>
      {isCountRequired && (
        <Label type="small" style={[styles.labelStyle, styles.helpText]}>
          {t('charactersRemaining', { wordCount })}
        </Label>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  labelStyle: {
    marginVertical: 6,
    color: theme.colors.darkTint3,
  },
  textAreaContainer: {
    height: 150,
    borderColor: theme.colors.disabled,
    borderWidth: 1,
    padding: PlatformUtils.isWeb() ? 0 : 5,
  },
  textArea: {
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
  },
  helpText: {
    paddingVertical: 6,
  },
  labelView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelHelper: {
    color: theme.colors.darkTint3,
  },
});
