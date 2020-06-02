import React, { useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
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

const HorizontalPicker = (): React.ReactElement => {
  const [selected, setSelected] = useState(5);
  const refPicker: React.MutableRefObject<FlatList | null> = useRef(null);

  const handleChange = (index: number): void => {
    setSelected(index);
    refPicker?.current?.scrollToIndex({
      animated: true,
      index,
      viewOffset: -30,
    });
  };

  return (
    <View style={styles.container}>
      <SmoothPicker
        data={data}
        initialScrollToIndex={selected}
        refFlatList={refPicker}
        keyExtractor={keyExtractor}
        horizontal
        scrollAnimation
        showsHorizontalScrollIndicator={false}
        onSelected={({ item, index }: IItem): void => handleChange(index)}
        renderItem={(option: IItem): React.ReactElement => ItemToRender(option, selected)}
        magnet
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
    borderColor: theme.colors.darkTint11,
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
    borderColor: isSelected ? theme.colors.darkTint11 : theme.colors.transparent,
    borderTopColor: theme.colors.transparent,
    borderBottomColor: theme.colors.transparent,
    width: 50,
  },
  itemStyle: {
    color: isSelected ? theme.colors.primaryColor : theme.colors.darkTint10,
  },
});
