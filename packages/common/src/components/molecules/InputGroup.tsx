import React from 'react';
import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IInputGroupProps {
  data: string[];
  updateData: (values: string[]) => void;
  maxLimit?: number;
  label?: string;
  buttonLabel?: string;
  placeholder?: string;
  inputContainer?: StyleProp<ViewStyle>;
  textInputContainerDeviceStyle?: StyleProp<ViewStyle>;
  textInputDeviceStyle?: StyleProp<ViewStyle>;
  addButtonDeviceStyle?: StyleProp<ViewStyle>;
}

const InputGroup = (props: IInputGroupProps): React.ReactElement => {
  const { t } = useTranslation();
  const {
    inputContainer,
    data,
    updateData,
    textInputContainerDeviceStyle,
    textInputDeviceStyle,
    maxLimit = 5,
    addButtonDeviceStyle,
    label,
    buttonLabel = t('add'),
    placeholder = t('property:highlightPlaceholder'),
  } = props;

  const handleTextChange = (text: string, index: number): void => {
    const newData: string[] = data;
    newData[index] = text;
    updateData(newData);
  };

  const handleNext = (): void => {
    updateData([...data, '']);
  };

  const onPressCross = (index: number): void => {
    if (data[index]) {
      const newData: string[] = data;
      newData[index] = '';
      updateData(newData);
    } else {
      updateData(data.slice(0, -1));
    }
  };

  return (
    <>
      <View style={[styles.container, inputContainer]}>
        {!!label && <Label style={styles.label}>{label}</Label>}
        {data.map((item, index) => {
          return (
            <View
              style={[
                styles.textInputContainer,
                textInputContainerDeviceStyle,
                styles.textInputWrapper,
                textInputDeviceStyle,
              ]}
              key={index}
            >
              <TextInput
                placeholder={placeholder}
                autoCorrect={false}
                autoCapitalize="words"
                numberOfLines={1}
                value={data[index]}
                onChangeText={(text): void => handleTextChange(text, index)}
                style={styles.textInput}
              />
              {data.length > 1 && index > 0 && (
                <Button
                  type="primary"
                  icon={icons.circularCrossFilled}
                  iconSize={20}
                  iconColor={theme.colors.darkTint9}
                  containerStyle={styles.iconButton}
                  onPress={(): void => onPressCross(index)}
                  testID="btnCross"
                />
              )}
            </View>
          );
        })}
      </View>
      {data.length !== maxLimit && (
        <View style={[styles.addButtonWrapper, addButtonDeviceStyle]}>
          <Button
            type="secondary"
            title={buttonLabel}
            containerStyle={[styles.addButton, textInputDeviceStyle]}
            onPress={handleNext}
          />
        </View>
      )}
    </>
  );
};

export default InputGroup;

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 12,
    marginVertical: 8,
    borderColor: theme.colors.darkTint10,
  },
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
    flexWrap: 'wrap',
  },
  iconButton: {
    flex: 0,
    backgroundColor: theme.colors.secondaryColor,
    marginRight: 14,
  },
  textInputWrapper: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  textInput: {
    width: '90%',
  },
  addButtonWrapper: {
    flex: 0,
    flexDirection: 'row',
  },
  addButton: {
    borderStyle: 'dashed',
  },
  label: {
    color: theme.colors.darkTint3,
  },
});
