import React, { FC, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';

interface IProps {
  toggleButton1Text: string;
  toggleButton2Text: string;
  toggleButton1: () => void;
  toggleButton2: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<ViewStyle>;
}

// TODO: Replace this component with SelectionPicker
export const ToggleButtons: FC<IProps> = ({
  toggleButton1Text,
  toggleButton2Text,
  toggleButton1,
  toggleButton2,
  containerStyle,
  buttonStyle,
  titleStyle = {},
}: IProps) => {
  const [selectedButton, setSelectedButton] = useState(1);
  const switchButton1 = (): void => {
    setSelectedButton(1);
    toggleButton1();
  };
  const switchButton2 = (): void => {
    setSelectedButton(2);
    toggleButton2();
  };
  return (
    <View style={[styles.toggleButtonsContainer, containerStyle]}>
      <Button
        type="primary"
        containerStyle={[styles.toggleButtons, buttonStyle, selectedButton === 1 && styles.toggleButton1Selected]}
        title={toggleButton1Text}
        titleStyle={[styles.unselectedText, titleStyle, selectedButton === 1 && styles.selectedText]}
        textSize="small"
        textType="text"
        fontType="semiBold"
        onPress={switchButton1}
      />
      <Button
        type="primary"
        containerStyle={[styles.toggleButtons, buttonStyle, selectedButton === 2 && styles.toggleButton2Selected]}
        title={toggleButton2Text}
        titleStyle={[styles.unselectedText, titleStyle, selectedButton === 2 && styles.selectedText]}
        textSize="small"
        textType="text"
        fontType="semiBold"
        onPress={switchButton2}
      />
    </View>
  );
};

export default ToggleButtons;

const styles = StyleSheet.create({
  toggleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    width: 'fit-content',
    alignSelf: 'center',
    padding: 4,
    borderRadius: 4,
  },
  toggleButtons: {
    backgroundColor: theme.colors.transparent,
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    width: 'fit-content',
  },
  toggleButton1Selected: {
    backgroundColor: theme.colors.completed,
  },
  toggleButton2Selected: {
    backgroundColor: theme.colors.blue,
  },
  unselectedText: {
    color: theme.colors.darkTint5,
  },
  selectedText: {
    color: theme.colors.white,
  },
  toggleButtonText: {
    color: theme.colors.darkTint5,
  },
  toggleButtonTextSelected: {
    color: theme.colors.white,
  },
});
