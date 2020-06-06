import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SmoothPicker from 'react-native-smooth-picker';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components';

interface IItemProps {
  opacity: number;
  selected: boolean;
  value: string | number;
}

interface IItem {
  item: number;
  index: number;
}

interface IProps {
  value: number;
  onValueChange: (index: string | number) => void;
}

const data = [...Array(10).keys()];

const Item = (props: IItemProps): React.ReactElement => {
  const { opacity, selected, value } = props;
  const conditionalStyle = createConditionalStyles(opacity, selected);
  return (
    <View style={[styles.optionWrapper, conditionalStyle.viewItem]}>
      <Text
        type={selected ? 'regular' : 'small'}
        textType={selected ? 'bold' : 'regular'}
        style={conditionalStyle.itemStyle}
      >
        {value}
      </Text>
    </View>
  );
};

const ItemToRender = ({ item, index }: IItem, indexSelected: number): React.ReactElement => {
  const selected = index === indexSelected;
  return <Item opacity={selected ? 1 : 0.8} selected={selected} value={item} />;
};

const keyExtractor = (item: number, index: number): string => index.toString();

const HorizontalPicker = (props: IProps): React.ReactElement => {
  const { onValueChange, value } = props;
  const [selected, setSelected] = useState(value);

  const handleChange = (index: number): void => {
    setSelected(index);
    onValueChange(index);
  };

  return (
    <View style={styles.container}>
      <SmoothPicker
        data={data}
        initialScrollToIndex={selected}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        onSelected={({ item, index }: IItem): void => handleChange(index)}
        renderItem={(option: IItem): React.ReactElement => ItemToRender(option, selected)}
      />
    </View>
  );
};

export { HorizontalPicker };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: theme.colors.darkTint6,
    borderWidth: 0.5,
    width: 150,
    borderRadius: 4,
  },
  optionWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderWidth: 0.5,
    marginTop: 3,
    marginBottom: 3,
  },
});

// TODO: (Rishabh:02/06/20) - Need to check the return type
const createConditionalStyles = (opacity: number, isSelected: boolean): any => ({
  viewItem: {
    opacity,
    borderColor: isSelected ? theme.colors.darkTint6 : theme.colors.transparent,
    borderTopColor: theme.colors.transparent,
    borderBottomColor: theme.colors.transparent,
    width: 50,
  },
  itemStyle: {
    color: isSelected ? theme.colors.primaryColor : theme.colors.darkTint11,
  },
});
