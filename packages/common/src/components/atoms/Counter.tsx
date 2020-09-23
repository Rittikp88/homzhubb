import React, { ReactElement, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label, Text, SVGUri } from '@homzhub/common/src/components';

interface ITitle {
  title: string;
  id: number;
}

interface IProps {
  defaultValue: number;
  name?: ITitle;
  svgImage?: string;
  onValueChange: (count: number, id?: number) => void;
  maxCount?: number;
  minCount?: number;
  containerStyles?: StyleProp<ViewStyle>;
  testID?: string;
}

export const Counter = (props: IProps): React.ReactElement => {
  const { onValueChange, defaultValue, name, svgImage, maxCount = 10, minCount = 0, containerStyles } = props;
  const [count, setCount] = useState(defaultValue);

  const incrementCount = (): void => {
    if (count < maxCount) {
      setCount((prev) => prev + 1);
      onValueChange(count, name?.id);
    }
  };

  const decrementCount = (): void => {
    if (count > minCount) {
      setCount((prev) => prev - 1);
      onValueChange(count, name?.id);
    }
  };

  const renderCounter = (): ReactElement => {
    return (
      <View style={[styles.counterContainer, styles.rowStyle]}>
        <Icon name={icons.minus} color={theme.colors.primaryColor} size={20} onPress={decrementCount} />
        <Label type="large">{count}</Label>
        <Icon name={icons.plus} color={theme.colors.primaryColor} size={20} onPress={incrementCount} />
      </View>
    );
  };

  return (
    <View style={[styles.rowStyle, containerStyles]}>
      <View style={styles.imageContainer}>
        {svgImage && <SVGUri height={20} width={20} uri={svgImage} />}
        {name && (
          <Text style={styles.textStyle} type="small">
            {name.title}
          </Text>
        )}
      </View>
      {renderCounter()}
    </View>
  );
};

const styles = StyleSheet.create({
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  counterContainer: {
    borderColor: theme.colors.darkTint6,
    borderWidth: 1,
    borderRadius: 4,
    width: 100,
    padding: 4,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    marginLeft: 12,
  },
});
