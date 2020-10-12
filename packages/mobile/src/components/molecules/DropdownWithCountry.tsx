import React, { useState } from 'react';
import { PickerItemProps, StyleSheet, View } from 'react-native';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { Dropdown } from '@homzhub/common/src/components';

interface IProps {
  countryData: PickerItemProps[];
  dropdownData: PickerItemProps[];
  onSelectProperty: (value: number) => void;
}

export const DropdownWithCountry = (props: IProps): React.ReactElement => {
  const { dropdownData, countryData, onSelectProperty } = props;
  const [dataValue, setDataValue] = useState(0);
  const onSelectData = (value: string | number): void => {
    setDataValue(value as number);
    onSelectProperty(value as number);
  };

  return (
    <View style={styles.container}>
      <Dropdown
        data={countryData}
        showImage
        value={1}
        onDonePress={FunctionUtils.noop}
        imageStyle={styles.image}
        containerStyle={styles.imageDropdown}
      />
      <Dropdown
        data={dropdownData}
        value={dataValue}
        maxLabelLength={16}
        onDonePress={onSelectData}
        textStyle={styles.text}
        containerStyle={styles.labelDropdown}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    marginRight: 20,
    borderRadius: 4,
    width: 20,
  },
  imageDropdown: {
    paddingVertical: 10,
  },
  text: {
    marginRight: 40,
  },
  labelDropdown: {
    paddingVertical: 8,
    width: 220,
  },
});
