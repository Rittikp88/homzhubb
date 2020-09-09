import React from 'react';
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  label: string;
  value: string;
  placeholder: string;
  isOptional?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  onMessageChange?: (text: string) => void;
}

const MAX_WORD_COUNT = 250;

export const TextArea = (props: IProps): React.ReactElement => {
  const { label, placeholder, isOptional, containerStyle = {}, onMessageChange, value } = props;
  const { t } = useTranslation();
  const wordCount = value.length === 0 ? MAX_WORD_COUNT : MAX_WORD_COUNT - value.length;
  return (
    <View style={containerStyle}>
      <View style={styles.labelView}>
        <Label type="large" style={styles.labelStyle}>
          {label}
        </Label>
        {isOptional && (
          <Label type="regular" style={{ color: theme.colors.darkTint3 }}>
            {t('optional')}
          </Label>
        )}
      </View>
      <View style={styles.textAreaContainer}>
        <TextInput
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
  helpText: {
    paddingVertical: 6,
  },
});
