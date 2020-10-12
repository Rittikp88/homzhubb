import React from 'react';
import { View, StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { RNCheckbox } from '@homzhub/common/src/components/atoms/Checkbox';

export interface ICheckboxGroupData {
  id: number;
  label: string;
  isSelected: boolean;
}

export interface ICheckboxGroupProps {
  data: ICheckboxGroupData[];
  onToggle: (id: number, isSelected: boolean) => void;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export class CheckboxGroup extends React.PureComponent<ICheckboxGroupProps, {}> {
  public render = (): React.ReactNode => {
    const { data, containerStyle = {} } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.col}>
          {data.filter((item, index) => index % 2 === 0).map((item) => this.renderCheckbox(item))}
        </View>
        <View style={styles.col}>
          {data.filter((item, index) => index % 2 !== 0).map((item) => this.renderCheckbox(item))}
        </View>
      </View>
    );
  };

  private renderCheckbox = (item: ICheckboxGroupData): React.ReactElement => {
    const { label, isSelected = false } = item;
    const { onToggle, labelStyle = {}, testID } = this.props;
    const onCheckboxToggle = (): void => onToggle(item.id, !isSelected);

    return (
      <RNCheckbox
        key={`${item.id}`}
        selected={isSelected}
        label={label}
        onToggle={onCheckboxToggle}
        labelStyle={labelStyle}
        containerStyle={styles.checkboxContainer}
        testID={testID}
      />
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  col: {
    flex: 0.5,
  },
  checkboxContainer: {
    marginVertical: 12,
  },
});
