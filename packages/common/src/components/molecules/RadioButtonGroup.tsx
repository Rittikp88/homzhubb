import React from 'react';
import { FlatList, StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { RadioButton } from '@homzhub/common/src/components/atoms/RadioButton';
import { IRadiaButtonGroupData } from '@homzhub/mobile/src/screens/Asset/Search/ContactForm';

interface IProps {
  data: IRadiaButtonGroupData[];
  onToggle: (id: number) => void;
  selectedValue: number;
  numColumns?: number;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export class RadioButtonGroup extends React.Component<IProps, {}> {
  public render = (): React.ReactNode => {
    const { data, numColumns = 2, containerStyle = {} } = this.props;
    return (
      <FlatList<IRadiaButtonGroupData>
        numColumns={numColumns}
        data={data}
        renderItem={this.renderButton}
        contentContainerStyle={containerStyle}
        keyExtractor={(item): string => `${item.id}`}
      />
    );
  };

  private renderButton = ({ item, index }: { item: IRadiaButtonGroupData; index: number }): React.ReactElement => {
    const { label } = item;
    const { data, onToggle, numColumns = 2, labelStyle = {}, selectedValue } = this.props;

    let buttonContainerStyle: { flex: number; marginBottom: number } | { marginBottom: number } =
      styles.buttonContainer;
    if (index >= data.length - numColumns) {
      buttonContainerStyle = StyleSheet.flatten([styles.buttonContainer, { marginBottom: 0 }]);
    }

    const onButtonToggle = (): void => onToggle(item.id);
    const isSelected = item.id === selectedValue;

    return (
      <RadioButton
        selected={isSelected}
        label={label}
        onToggle={onButtonToggle}
        labelStyle={labelStyle}
        containerStyle={buttonContainerStyle}
      />
    );
  };
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    marginBottom: 20,
  },
});