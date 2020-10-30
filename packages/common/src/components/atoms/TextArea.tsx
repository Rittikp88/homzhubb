import React from 'react';
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  label?: string;
  value: string;
  placeholder: string;
  containerStyle?: StyleProp<ViewStyle>;
  onMessageChange?: (text: string) => void;
  wordCountLimit?: number;
}

export const TextArea = (props: IProps): React.ReactElement => {
  const { label, placeholder, containerStyle = {}, onMessageChange, value, wordCountLimit = 250 } = props;
  const { t } = useTranslation();
  const wordCount = value.length === 0 ? wordCountLimit : wordCountLimit - value.length;
  return (
    <View style={containerStyle}>
      <Label type="large" style={styles.labelStyle}>
        {label}
      </Label>
      <View style={styles.textAreaContainer}>
        <TextInput
          autoCorrect={false}
          style={styles.textArea}
          placeholder={placeholder}
          maxLength={250}
          multiline
          value={value}
          onChangeText={onMessageChange}
        />
      </View>
      <Label type="small" style={[styles.labelStyle, styles.helpText]}>
        {t('charactersRemaining', { wordCount })}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  labelStyle: {
    marginVertical: 6,
    color: theme.colors.darkTint3,
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
  helpText: {
    paddingVertical: 6,
  },
});
