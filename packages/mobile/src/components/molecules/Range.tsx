import React, { useEffect, useState } from 'react';
import { PickerItemProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CurrencyUtils } from '@homzhub/common/src/utils/CurrencyUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Dropdown } from '@homzhub/common/src/components/atoms/Dropdown';
import { Label, Text } from '@homzhub/common/src/components/atoms/Text';
import { Slider } from '@homzhub/common/src/components/atoms/Slider';

interface IRange {
  min: number;
  max: number;
}

interface IProps {
  dropdownData: PickerItemProps[];
  selectedUnit?: string | number;
  isPriceRange?: boolean;
  range: IRange;
  currencySymbol?: string;
  minChangedValue: number;
  maxChangedValue: number;
  onChangeSlide: (type: string, value: number | number[]) => void;
  containerStyle?: StyleProp<ViewStyle>;
  onDropdownValueChange?: (value: string | number) => void;
}

const ShowInMvpRelease = false;

export const Range = (props: IProps): React.ReactElement => {
  const {
    dropdownData,
    onChangeSlide,
    range,
    minChangedValue,
    maxChangedValue,
    currencySymbol,
    containerStyle,
    isPriceRange,
    selectedUnit,
    onDropdownValueChange,
  } = props;
  const { t } = useTranslation();
  const [dropdownValue, setValue] = useState<string | number>('');
  useEffect(() => {
    if (selectedUnit) {
      setValue(selectedUnit);
    }
  }, [selectedUnit]);
  const onUnitChange = (value: string | number): void => {
    setValue(value as string);
    if (onDropdownValueChange) {
      onDropdownValueChange(value);
    }
  };
  const getCurrencyValue = (value: number): string => CurrencyUtils.getCurrency(dropdownValue.toString(), value);
  const currentCarpetAreaUnit = dropdownData.filter((obj: PickerItemProps) => obj.value === selectedUnit)[0].label;
  const getAreaValue = (value: number): string => `${value.toLocaleString()} ${currentCarpetAreaUnit}`;

  const maxChanged = isPriceRange
    ? `${currencySymbol}${getCurrencyValue(maxChangedValue)}`
    : getAreaValue(maxChangedValue);

  const minChanged = isPriceRange
    ? `${currencySymbol}${getCurrencyValue(minChangedValue)}`
    : getAreaValue(minChangedValue);

  const maxValue = maxChangedValue > 0 && maxChangedValue < range.max ? maxChanged : t('any');
  const minValue = minChangedValue > 0 && minChangedValue > range.min ? minChanged : t('any');

  const onUpdatePrice = (value1: number, value2?: number): void => {
    if (isPriceRange) {
      onChangeSlide('min_price', value1);
      onChangeSlide('max_price', value2 || 0);
    } else {
      onChangeSlide('min_area', value1);
      onChangeSlide('max_area', value2 || 0);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.rangeRow}>
        <Text type="small" textType="semiBold" style={styles.priceRange}>
          {isPriceRange ? t('priceRange') : t('propertySearch:carpetArea')}
        </Text>
        {ShowInMvpRelease && (
          <Dropdown
            data={dropdownData}
            icon={icons.downArrow}
            iconColor={theme.colors.darkTint5}
            iconSize={8}
            textStyle={styles.dropdownTextStyle}
            value={dropdownValue}
            onDonePress={onUnitChange}
            containerStyle={styles.dropdownContainer}
            testID="areaUnit"
          />
        )}
      </View>
      <View style={styles.sliderView}>
        <Text type="regular" style={styles.sliderValue}>
          {minValue}{' '}
          <Label type="regular" textType="regular">
            {t('to')}
          </Label>{' '}
          {maxValue}
        </Text>
        <Slider
          key={range.max}
          onSliderChange={onUpdatePrice}
          isMultipleSlider
          minSliderRange={range.min}
          maxSliderRange={range.max}
          minSliderValue={minChangedValue}
          maxSliderValue={maxChangedValue}
          testID="slider"
        />
        <View style={styles.rangeText}>
          <Label type="large" style={styles.rangeLabel}>
            {t('min')}
          </Label>
          <Label type="large" style={styles.rangeLabel}>
            {t('max')}
          </Label>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rangeRow: {
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
  rangeText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeLabel: {
    color: theme.colors.darkTint5,
  },
  priceRange: {
    color: theme.colors.darkTint4,
  },
});
