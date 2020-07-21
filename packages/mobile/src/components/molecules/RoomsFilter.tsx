import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { remove } from 'lodash';
import { theme } from '@homzhub/common/src/styles/theme';
import { SelectionPicker, Text } from '@homzhub/common/src/components';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';

interface IProps {
  bedCount: number[];
  bathroomCount: number[];
  onSelection: (type: string, value: number | number[]) => void;
}

// TODO: To be moved either in redux or constants?
const bedroom = [
  {
    title: 'Any',
    value: -1,
  },
  {
    title: '1',
    value: 1,
  },
  {
    title: '2',
    value: 2,
  },
  {
    title: '3',
    value: 3,
  },
  {
    title: '4',
    value: 4,
  },
  {
    title: '5+',
    value: 5,
  },
];

const bathroom = [
  {
    title: 'Any',
    value: -1,
  },
  {
    title: '1+',
    value: 1,
  },
  {
    title: '2+',
    value: 2,
  },
  {
    title: '3+',
    value: 3,
  },
  {
    title: '4+',
    value: 4,
  },
  {
    title: '5+',
    value: 5,
  },
];

const OPTION_WIDTH = (theme.viewport.width - 40) / 6;

export const RoomsFilter = (props: IProps): React.ReactElement => {
  const { bedCount, bathroomCount, onSelection } = props;

  const { t } = useTranslation(LocaleConstants.namespacesKey.propertySearch);

  const bubbleSelectedValue = (type: string, value: number | number[]): void => onSelection(type, value);

  const onUpdateBedroomCount = (value: number): void => {
    if (value !== -1) {
      remove(bedCount, (count: number) => count === -1);
      if (bedCount.includes(value)) {
        remove(bedCount, (count: number) => count === value);
        const newBedroomCount = bedCount.length === 0 ? [-1] : bedCount;
        bubbleSelectedValue('room_count', newBedroomCount);
      } else {
        const newBedroomCount = bedCount.concat(value);
        bubbleSelectedValue('room_count', newBedroomCount);
      }
    } else {
      const newBedroomCount = [-1];
      bubbleSelectedValue('room_count', newBedroomCount);
    }
  };

  const onUpdateBathroomCount = (value: number): void => bubbleSelectedValue('bath_count', value);

  return (
    <View style={styles.container}>
      <Text type="small" textType="semiBold" style={styles.textStyle}>
        {t('beds')}
      </Text>
      <SelectionPicker
        data={bedroom}
        selectedItem={bedCount}
        onValueChange={onUpdateBedroomCount}
        optionWidth={OPTION_WIDTH}
      />
      <Text type="small" textType="semiBold" style={[styles.textStyle, styles.pickerMargin]}>
        {t('baths')}
      </Text>
      <SelectionPicker
        data={bathroom}
        selectedItem={bathroomCount}
        onValueChange={onUpdateBathroomCount}
        optionWidth={OPTION_WIDTH}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingHorizontal: 2,
    paddingTop: 0,
  },
  textStyle: {
    color: theme.colors.darkTint4,
  },
  pickerMargin: {
    marginVertical: 15,
  },
});
