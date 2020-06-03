import React from 'react';
import { SafeAreaView, TouchableOpacity, FlatList, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text, Label, TextFieldType } from '@homzhub/common/src/components';

interface IButtonGroupProps {
  data: any;
  onItemSelect: (id: string | number) => void;
  selectedIndex: number;
  textType: TextFieldType;
  textStyle?: StyleProp<TextStyle>;
  superTitle?: string;
  title?: string;
}

interface IStateProps {
  numOfColumns: number;
}

const { width, height } = theme.viewport;
const SCREEN_WIDTH = width < height ? width : height;
let columns = 1;
if (SCREEN_WIDTH <= 393) {
  columns = 1;
} else if (SCREEN_WIDTH > 393 && SCREEN_WIDTH <= 414) {
  columns = 2;
} else {
  columns = 3;
}

class ItemGroup extends React.PureComponent<IButtonGroupProps, IStateProps> {
  public state = {
    numOfColumns: columns,
  };

  public render(): React.ReactElement {
    const { data, selectedIndex } = this.props;
    const { numOfColumns } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          renderItem={this.renderItem}
          numColumns={numOfColumns}
          key={numOfColumns}
          keyExtractor={this.keyExtractor}
          extraData={data?.[selectedIndex] ?? []}
        />
      </SafeAreaView>
    );
  }

  public renderItem = ({ item, index }: { item: any; index: number }): React.ReactElement => {
    const { selectedIndex, onItemSelect, textStyle, superTitle, textType, data } = this.props;
    const dataLength = data.length;
    const isSelected = index === selectedIndex;
    const conditionalStyle = createConditionalStyles(isSelected, dataLength);
    const onItemPress = (): void => onItemSelect(index);
    return (
      <TouchableOpacity onPress={onItemPress} style={[conditionalStyle.itemContainer, conditionalStyle.item]}>
        {superTitle && (
          <Label type="regular" textType="regular" style={[textStyle, conditionalStyle.itemContainer]}>
            {superTitle}
          </Label>
        )}
        {textType === 'text' ? (
          <Text type="small" textType="semiBold" style={[textStyle, conditionalStyle.itemContainer]}>
            {item.name}
          </Text>
        ) : (
          <Label type="large" textType="regular" style={[textStyle, conditionalStyle.itemContainer]}>
            {item.name}
          </Label>
        )}
      </TouchableOpacity>
    );
  };

  public keyExtractor = (item: any, index: number): string => item.id;
}

export default ItemGroup;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexGrow: 1,
    flexDirection: 'row',
    marginTop: 15,
    maxWidth: SCREEN_WIDTH,
  },
});

// TODO: Need to check the return type
const createConditionalStyles = (isSelected: boolean, dataLength: number): any => ({
  itemContainer: {
    backgroundColor: isSelected ? theme.colors.primaryColor : theme.colors.white,
    color: isSelected ? theme.colors.white : theme.colors.darkTint5,
  },
  item: {
    flex: dataLength <= 2 ? 1 : 0,
    borderRadius: 8,
    borderColor: theme.colors.disabled,
    borderWidth: 1,
    padding: dataLength <= 2 ? 10 : 8,
    margin: 5,
  },
});
