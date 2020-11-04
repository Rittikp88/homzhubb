import React, { useState } from 'react';
import { PickerItemProps, StyleSheet, View } from 'react-native';
import { Dropdown } from '@homzhub/common/src/components';
import { Country } from '@homzhub/common/src/domain/models/Country';

interface IProps {
  countryData: Country[];
  dropdownData: PickerItemProps[];
  onSelectProperty: (value: number) => void;
}

export const DropdownWithCountry = (props: IProps): React.ReactElement | null => {
  const { dropdownData, countryData, onSelectProperty } = props;
  const [dataValue, setDataValue] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const onSelectData = (value: string | number): void => {
    setDataValue(value as number);
    onSelectProperty(value as number);
  };

  if (countryData.length < 1) {
    return null;
  }

  const handleCountrySelection = (value: string | number): void => {
    const selectedCountry = countryData.findIndex((data) => data.iso2Code === value);
    setSelectedIndex(selectedCountry);
  };

  const countryMenu = countryData.map((item) => {
    return {
      label: item.name,
      value: item.iso2Code,
    };
  });

  return (
    <View style={styles.container}>
      <Dropdown
        data={countryMenu}
        showImage
        value={countryData[selectedIndex].iso2Code}
        image={countryData[selectedIndex].flag}
        onDonePress={handleCountrySelection}
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
    height: 12,
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
