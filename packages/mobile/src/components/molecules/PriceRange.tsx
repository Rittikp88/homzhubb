import React, { useState } from 'react';
import { PickerItemProps, StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Dropdown, Label, Slider, Text } from '@homzhub/common/src/components';
import { CurrencyUtils } from '@homzhub/common/src/utils/CurrencyUtils';

interface IRange {
  min: number;
  max: number;
}

interface IProps {
  currencyData: PickerItemProps[];
  range: IRange;
  currencySymbol: string;
  minChangedValue: number;
  maxChangedValue: number;
  onChangeSlide: (value1: number, value2?: number) => void;
}

export const PriceRange = (props: IProps): React.ReactElement => {
  const { currencyData, onChangeSlide, range, minChangedValue, maxChangedValue, currencySymbol } = props;
  const [currency, setCurrency] = useState('INR');
  const onCurrencyChange = (value: string | number): void => {
    setCurrency(value as string);
  };
  const getCurrencyValue = (value: number): string => CurrencyUtils.getCurrency(currency, value);
  const maxValue = maxChangedValue > 0 ? `${currencySymbol}${getCurrencyValue(maxChangedValue)}` : 'Any';
  const minValue = minChangedValue > 0 ? `${currencySymbol}${getCurrencyValue(minChangedValue)}` : 'Any';

  return (
    <>
      <View style={styles.rangeRow}>
        <Text type="small" textType="semiBold" style={{ color: theme.colors.darkTint4 }}>
          Price Range
        </Text>
        <Dropdown
          data={currencyData}
          icon={icons.downArrow}
          iconColor={theme.colors.darkTint5}
          iconSize={8}
          textStyle={styles.dropdownTextStyle}
          value={currency}
          onDonePress={onCurrencyChange}
          containerStyle={styles.dropdownContainer}
        />
      </View>
      <View style={styles.sliderView}>
        <Text type="regular" style={styles.sliderValue}>
          {minValue}{' '}
          <Label type="regular" textType="regular">
            to
          </Label>{' '}
          {maxValue}
        </Text>
        <Slider
          key={range.max}
          onSliderChange={onChangeSlide}
          isMultipleSlider
          minSliderRange={range.min}
          maxSliderRange={range.max}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  rangeRow: {
    marginTop: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownContainer: {
    borderWidth: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  dropdownTextStyle: {
    color: theme.colors.darkTint5,
    marginEnd: 6,
  },
  sliderView: {
    marginHorizontal: 10,
  },
  sliderValue: {
    color: theme.colors.darkTint1,
    paddingTop: 10,
  },
});
