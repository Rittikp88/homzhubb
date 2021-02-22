import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';

interface IProps {
  onUploadImage: () => void;
  onSubmit: () => void;
}

const ChatInputBox = (props: IProps): React.ReactElement => {
  const { onSubmit, onUploadImage } = props;
  const { t } = useTranslation();
  // states
  const [value, setValue] = useState('');
  const [isImage, setIsImage] = useState(false);

  const onChangeText = (text: string): void => {
    setValue(text);
  };

  const onPressIcon = (): void => {
    setIsImage(!isImage);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressIcon}>
        <Icon
          name={isImage ? icons.circularCrossFilled : icons.circularPlus}
          color={theme.colors.blue}
          size={28}
          style={styles.icon}
        />
      </TouchableOpacity>
      {isImage && (
        <Icon
          name={icons.filledGallery}
          color={theme.colors.blue}
          size={28}
          onPress={onUploadImage}
          style={styles.gallery}
        />
      )}
      {!isImage && (
        <TextInput
          placeholder={t('common:typeYourMessage')}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
        />
      )}
      <TouchableOpacity onPress={onSubmit}>
        <Icon name={icons.circularArrow} color={theme.colors.blue} size={40} style={styles.send} />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInputBox;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  icon: {
    marginRight: 6,
  },
  gallery: {
    marginLeft: 8,
    paddingVertical: 18.5,
    flex: 1,
  },
  input: {
    paddingVertical: 24,
    flex: 1,
  },
  send: {
    marginHorizontal: 4,
  },
});
