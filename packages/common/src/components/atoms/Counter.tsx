import React, { useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  value: number;
  onValueChange: (index: number) => void;
  maxCount?: number;
  containerStyles?: StyleProp<ViewStyle>;
  testID?: string;
}

export const Counter = (props: IProps): React.ReactElement => {
  const { onValueChange, value, maxCount = 10, containerStyles } = props;
  const [count, setCount] = useState(value);

  const incrementCount = (): void => {
    if (count < maxCount) {
      setCount((prev) => prev + 1);
      onValueChange(count);
    }
  };

  const decrementCount = (): void => {
    if (count > 0) {
      setCount((prev) => prev - 1);
      onValueChange(count);
    }
  };

  return (
    <View style={[styles.container, containerStyles]}>
      <Icon name={icons.minus} color={theme.colors.primaryColor} size={20} onPress={decrementCount} />
      <Label type="large">{count}</Label>
      <Icon name={icons.plus} color={theme.colors.primaryColor} size={20} onPress={incrementCount} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: theme.colors.darkTint6,
    borderWidth: 1,
    borderRadius: 4,
    width: 100,
    padding: 4,
  },
});
