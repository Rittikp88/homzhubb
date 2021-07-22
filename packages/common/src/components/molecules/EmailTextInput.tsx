import React, { useEffect, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputChangeEventData,
  TextInputKeyPressEventData,
  View,
  StyleSheet,
} from 'react-native';
import { useTranslation} from 'react-i18next';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  data?: string[];
  onSetEmails: (emails: string[]) => void;
}

const EmailTextInput = ({ data, onSetEmails }: IProps): React.ReactElement => {
  const [emails, setEmails] = useState<string[]>([]);
  const [value, setValue] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (data && data.length > 0) {
      setEmails(data);
    }
  }, [data]);

  const handleChange = (event: NativeSyntheticEvent<TextInputChangeEventData>): void => {
    const { text } = event.nativeEvent;

    if (text.includes(',')) return;
    setValue(text);
  };

  const handleRemove = (email: string): void => {
    setEmails(emails.filter((item) => item !== email));
  };

  const handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>): void => {
    const { key } = event.nativeEvent;
    if ([','].includes(key)) {
      event.preventDefault();
      const email = value.trim();
      if (email) {
        const updated: string[] = [...emails, email];
        setEmails(updated);
        onSetEmails(updated);
        setValue('');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Label type="large" style={styles.label}>
        {t('assetFinancial:notifyTo')}
      </Label>
      <View style={styles.itemContainer}>
        {emails.length > 0 && (
          <View style={styles.content}>
            {emails.map((item, index) => (
              <View key={index} style={styles.item}>
                <Label type="large" style={styles.itemLabel}>
                  {item}
                </Label>
                <Icon
                  name={icons.circularCrossFilled}
                  size={16}
                  color={theme.colors.darkTint4}
                  onPress={(): void => handleRemove(item)}
                />
              </View>
            ))}
          </View>
        )}
        {emails.length < 10 && (
          <TextInput
            placeholder={t('assetFinancial:enterEmails')}
            onChange={handleChange}
            autoFocus={emails.length > 0}
            value={value}
            onKeyPress={handleKeyPress}
          />
        )}
      </View>
    </View>
  );
};

export default EmailTextInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    color: theme.colors.darkTint4,
    marginBottom: 8,
  },
  itemContainer: {
    borderWidth: 1,
    padding: 12,
    borderColor: theme.colors.disabled,
    borderRadius: 4,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.lightGrayishBlue,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  itemLabel: {
    color: theme.colors.darkTint4,
    marginRight: 6,
  },
});
