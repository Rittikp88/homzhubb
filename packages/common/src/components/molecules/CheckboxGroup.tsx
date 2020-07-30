import React from 'react';
import { FlatList, StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { RNCheckbox } from '@homzhub/common/src/components/atoms/Checkbox';

export interface ICheckboxGroupData {
  id: number;
  label: string;
  isSelected: boolean;
}

interface IProps {
  data: ICheckboxGroupData[];
  onToggle: (id: number, isSelected: boolean) => void;
  numColumns?: number;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export class CheckboxGroup extends React.PureComponent<IProps, {}> {
  public render = (): React.ReactNode => {
    const { data, numColumns = 2, containerStyle = {} } = this.props;
    return (
      <FlatList<ICheckboxGroupData>
        numColumns={numColumns}
        data={data}
        renderItem={this.renderCheckbox}
        contentContainerStyle={containerStyle}
      />
    );
  };

  private renderCheckbox = ({ item, index }: { item: ICheckboxGroupData; index: number }): React.ReactElement => {
    const { label, isSelected = false } = item;
    const { data, onToggle, numColumns = 2, labelStyle = {} } = this.props;

    let checkboxContainerStyle: { flex: number; marginBottom: number } | { marginBottom: number } =
      styles.checkboxContainer;
    if (index >= data.length - numColumns) {
      checkboxContainerStyle = StyleSheet.flatten([styles.checkboxContainer, { marginBottom: 0 }]);
    }

    const onCheckboxToggle = (): void => onToggle(item.id, !isSelected);

    return (
      <RNCheckbox
        selected={isSelected}
        label={label}
        onToggle={onCheckboxToggle}
        labelStyle={labelStyle}
        containerStyle={checkboxContainerStyle}
      />
    );
  };
}

const styles = StyleSheet.create({
  checkboxContainer: {
    flex: 1,
    marginBottom: 20,
  },
});