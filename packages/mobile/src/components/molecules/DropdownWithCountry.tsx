import React, { useState } from 'react';
import { PickerItemProps, StyleSheet, View } from 'react-native';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { Dropdown } from '@homzhub/common/src/components';

interface IProps {
  countryData?: PickerItemProps[];
  dropdownData?: PickerItemProps[];
}

const data = [
  {
    label: 'All Properties',
    value: 1,
  },
  {
    label: 'Lounge Before Wicket',
    value: 2,
  },
  {
    label: 'Sobha Creation',
    value: 3,
  },
  {
    label: 'Paradise',
    value: 4,
  },
];

// TODO: (Shikha) - Refactor to make it more reusable after API integration

export const DropdownWithCountry = (props: IProps): React.ReactElement => {
  const [dataValue, setDataValue] = useState(1);
  const onSelectData = (value: string | number): void => {
    setDataValue(value as number);
  };
  return (
    <View style={styles.container}>
      <Dropdown
        data={[]}
        showImage
        value="1"
        onDonePress={FunctionUtils.noop}
        imageStyle={styles.image}
        containerStyle={styles.imageDropdown}
      />
      <Dropdown
        data={data}
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
