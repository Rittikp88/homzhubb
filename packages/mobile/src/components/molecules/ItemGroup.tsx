import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, TextStyle, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text, Label, TextFieldType } from '@homzhub/common/src/components';
import { IPropertyDetailsData, IPropertyTypes } from '@homzhub/common/src/domain/models/Property';

interface IButtonGroupProps {
  data: any;
  onItemSelect: (id: string | number) => void;
  selectedIndex: number;
  textType: TextFieldType;
  textStyle?: StyleProp<TextStyle>;
  superTitle?: string;
  title?: string;
}

class ItemGroup extends React.PureComponent<IButtonGroupProps> {
  public render(): React.ReactElement {
    const { data } = this.props;
    return (
      <View style={styles.container}>
        {data &&
          data.map((item: IPropertyDetailsData | IPropertyTypes, index: number) => {
            return this.renderItem(item, index);
          })}
      </View>
    );
  }

  public renderItem = (item: IPropertyDetailsData | IPropertyTypes, index: number): React.ReactElement => {
    const { selectedIndex, onItemSelect, textStyle, superTitle, textType, data } = this.props;
    const dataLength = data.length;
    const isSelected = index === selectedIndex;
    const conditionalStyle = createConditionalStyles(isSelected, dataLength);
    const onItemPress = (): void => onItemSelect(index);
    return (
      <TouchableOpacity
        onPress={onItemPress}
        style={[conditionalStyle.itemContainer, conditionalStyle.item]}
        key={index}
      >
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
}

export default ItemGroup;

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexGrow: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: 15,
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
    padding: 10,
    margin: 8,
  },
});
