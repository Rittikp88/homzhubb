import React, { useEffect, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputChangeEventData,
  View,
  StyleSheet,
  TextInputFocusEventData,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { FormUtils } from '@homzhub/common/src/utils/FormUtils';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import { WithFieldError } from '@homzhub/common/src/components/molecules/WithFieldError';

interface IProps {
  data?: string[];
  onSetEmails: (emails: string[]) => void;
  setEmailError: (isError: boolean) => void;
}

const EmailTextInput = ({ data, onSetEmails, setEmailError }: IProps): React.ReactElement => {
  const [emails, setEmails] = useState<string[]>([]);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (data && data.length > 0) {
      setEmails(data);
    }
  }, [data]);

  const handleChange = (event: NativeSyntheticEvent<TextInputChangeEventData>): void => {
    const { text } = event.nativeEvent;

    if (text.includes(',')) {
      event.preventDefault();
      const email = value.trim();
      if (email) {
        onUpdate(email);
      }

      return;
    }
    setEmailError(false);
    setError('');
    setValue(text);
  };

  const onEndEditing = (event: NativeSyntheticEvent<TextInputFocusEventData>): void => {
    const { text } = event.nativeEvent;
    if (text) {
      onUpdate(text);
    } else {
      setError('');
    }
  };

  const onUpdate = (text: string): void => {
    if (FormUtils.validateEmail(text)) {
      if (!emails.includes(text)) {
        const updated: string[] = [...emails, text];
        setEmails(updated);
        onSetEmails(updated);
        setValue('');
        setError('');
        setEmailError(false);
      } else {
        setEmailError(true);
        setError('auth:duplicateEmail');
      }
    } else {
      setEmailError(true);
      setError('landing:emailValidations');
    }
  };

  const handleRemove = (email: string): void => {
    setEmails(emails.filter((item) => item !== email));
    setError('');
  };

  return (
    <View style={styles.container}>
      <WithFieldError error={t(error)}>
        <Label type="large" style={[styles.label, !!error && styles.errorLabel]}>
          {t('assetFinancial:notifyTo')}
        </Label>
        <View style={[styles.itemContainer, !!error && styles.errorContainer]}>
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
              value={value}
              onChange={handleChange}
              autoFocus={emails.length > 0}
              onEndEditing={onEndEditing}
              placeholder={t('assetFinancial:enterEmails')}
            />
          )}
        </View>
      </WithFieldError>
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
  errorLabel: {
    color: theme.colors.error,
  },
  itemContainer: {
    borderWidth: 1,
    padding: 12,
    borderColor: theme.colors.disabled,
    borderRadius: 4,
  },
  errorContainer: {
    borderColor: theme.colors.error,
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
