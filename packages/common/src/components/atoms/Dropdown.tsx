import React from 'react';
import { StyleSheet, StyleProp, ViewStyle, PickerItemProps, View, ImageStyle } from 'react-native';
import { Picker, PickerIOS } from '@react-native-community/picker';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { ModalView } from '@homzhub/common/src/components/atoms/ModalView';

interface IProps {
  data: PickerItemProps[];
  value: number | string;
  onDonePress: (value: string | number) => void;
  disable?: boolean;
  placeholder?: string;
  iosDropdownStyle?: object;
  androidDropdownStyle?: object;
  androidContainerStyle?: StyleProp<ViewStyle>;
  iconColor?: string;
  iconSize?: number;
  placeholderStyle?: object;
  iconStyle?: StyleProp<ImageStyle>;
  itemStyle?: StyleProp<ViewStyle>;
}

const PickerItemIOS = PickerIOS.Item;

export class Dropdown extends React.PureComponent<IProps> {
  public state = {
    modalVisible: false,
    // eslint-disable-next-line react/destructuring-assignment
    value: this.props.value,
  };

  public render(): React.ReactNode {
    return PlatformUtils.isIOS() ? this.renderIos() : this.renderAndroid();
  }

  public renderAndroid(): React.ReactNode {
    const {
      data,
      value,
      placeholder,
      itemStyle,
      disable = false,
      androidDropdownStyle = {},
      androidContainerStyle = {},
    } = this.props;
    const selectedItem = data.find((d: PickerItemProps) => d.value === value);
    let pickerData = data;
    const color = theme.colors.shadow;
    if (placeholder && placeholder.length > 0) {
      const item: PickerItemProps = {
        value: placeholder,
        label: placeholder,
        color,
      };
      pickerData = [item, ...data];
    }
    return (
      <View
        style={[styles.containerAndroid, androidContainerStyle]}
        pointerEvents={disable ? 'none' : 'auto'}
        accessible
      >
        <Picker
          style={[styles.dropDownStyles, androidDropdownStyle]}
          mode="dropdown"
          itemStyle={itemStyle}
          selectedValue={selectedItem ? selectedItem.value : ''}
          onValueChange={this.onPickerValueChange}
        >
          {pickerData.map((item: PickerItemProps, index: number) => {
            return <Picker.Item key={index} label={item.label} value={item.value} color={item.color} />;
          })}
        </Picker>
      </View>
    );
  }

  public renderIos(): React.ReactNode {
    const {
      value,
      data,
      placeholder = '',
      disable = false,
      iosDropdownStyle = {},
      placeholderStyle = {},
      iconColor,
      iconSize,
      iconStyle,
    } = this.props;
    const selectedItem = data.find((d: PickerItemProps) => d.value === value);
    const placeHolderTextColor = theme.colors.disabled;
    let textColor = theme.colors.dark;
    if (!selectedItem) {
      textColor = placeHolderTextColor;
    }
    return (
      <View pointerEvents={disable ? 'none' : 'auto'}>
        <Button
          containerStyle={[styles.container, iosDropdownStyle]}
          onPress={this.openModal}
          type="secondary"
          title={selectedItem ? selectedItem.label : placeholder}
          titleStyle={[styles.titleText, placeholderStyle, { color: textColor }]}
          icon="down-arrow-filled"
          iconSize={iconSize || 16}
          iconColor={iconColor || theme.colors.disabled}
          iconStyle={[styles.iconStyle, iconStyle]}
        />
        {this.renderModal()}
      </View>
    );
  }

  private renderModal(): React.ReactNode {
    const { data, itemStyle } = this.props;
    const { modalVisible, value } = this.state;

    return (
      <ModalView
        animationType="slide"
        visible={modalVisible}
        onClose={this.closeModal}
        modalStyle={styles.modalSubContainer}
        modalContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalContentContainer}>
          <Button onPress={this.onCancel} type="secondary" title="Cancel" containerStyle={styles.modalButton} />
          <Button onPress={this.onDone} type="secondary" title="Done" containerStyle={styles.modalButton} />
        </View>
        <PickerIOS itemStyle={itemStyle} selectedValue={value} onValueChange={this.onPickerValueChange}>
          {data.map((item: PickerItemProps, index: number) => {
            return <PickerItemIOS key={index} value={item.value} label={item.label} />;
          })}
        </PickerIOS>
      </ModalView>
    );
  }

  public onPickerValueChange = (value: string | number): void => {
    const { placeholder, onDonePress } = this.props;
    const selectedValue = value === placeholder ? '' : value;
    this.setState({ value: selectedValue.toString() });
    if (onDonePress) {
      onDonePress(selectedValue);
    }
  };

  public onCancel = (): void => this.closeModal();

  public onDone = (): void => {
    const { value } = this.state;
    const { data, onDonePress } = this.props;
    const valueSelected = value.toString().length > 0 ? value : data[0].value;
    onDonePress(valueSelected);
    this.closeModal();
  };

  public openModal = (): void => this.setState({ modalVisible: true });

  public closeModal = (): void => this.setState({ modalVisible: false });
}

const styles = StyleSheet.create({
  dropDownStyles: {
    height: 50,
  },
  containerAndroid: {
    borderColor: theme.colors.darkTint5,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    margin: 5,
    backgroundColor: theme.colors.white,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  container: {
    flex: 0,
    margin: 5,
    flexDirection: 'row',
    borderColor: theme.colors.disabled,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.white,
  },
  titleText: {
    flex: 1,
    textAlign: 'left',
  },
  iconStyle: {
    marginRight: 20,
  },
  modalSubContainer: {
    height: theme.viewport.height / 3,
    backgroundColor: theme.colors.disabled,
    padding: 5,
  },
  modalContentContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  modalButton: {
    borderWidth: 0,
    flex: 0,
    backgroundColor: theme.colors.transparent,
  },
});
