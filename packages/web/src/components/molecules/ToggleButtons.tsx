import React, { useState, FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';

interface IProps {
  toggleButton1Text: string;
  toggleButton2Text: string;
  toggleButton1: () => void;
  toggleButton2: () => void;
}
// TODO: Replace this component with SelectionPicker
export const ToggleButtons: FC<IProps> = ({
  toggleButton1Text,
  toggleButton2Text,
  toggleButton1,
  toggleButton2,
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
    <View style={styles.toggleButtonsContainer}>
      <Button
        type="primary"
        containerStyle={[styles.toggleButtons, selectedButton === 1 && styles.toggleButton1Selected]}
        onPress={switchButton1}
      >
        {toggleButton1Text}
      </Button>
      <Button
        type="primary"
        containerStyle={[styles.toggleButtons, selectedButton === 2 && styles.toggleButton2Selected]}
        onPress={switchButton2}
      >
        {toggleButton2Text}
      </Button>
    </View>
  );
};

export default ToggleButtons;

const styles = StyleSheet.create({
  toggleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    width: 'fit-content',
    alignSelf: 'center',
    padding: 4,
    borderRadius: 4,
  },
  toggleButtons: {
    backgroundColor: theme.colors.transparent,
    paddingHorizontal: 36,
    paddingVertical: 12,
    textAlign: 'center',
    color: theme.colors.darkTint5,
    borderRadius: 4,
  },
  toggleButton1Selected: {
    backgroundColor: theme.colors.completed,
    color: theme.colors.white,
  },
  toggleButton2Selected: {
    backgroundColor: theme.colors.blue,
    color: theme.colors.white,
  },
});
