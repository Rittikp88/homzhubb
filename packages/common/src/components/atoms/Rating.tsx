import React from 'react';
import { StyleSheet } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Label } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  count: number;
}

const Rating = ({ count }: IProps): React.ReactElement => {
  const starColor = (): string => {
    if (count < 3) {
      return theme.colors.error;
    }
    if (count < 5) {
      return theme.colors.green;
    }
    return theme.colors.gold;
  };

  return (
    <>
      <Label textType="regular" type="regular" style={styles.countStyle}>
        {count}
      </Label>
      <Icon name={icons.starFilled} color={starColor()} size={12} />
    </>
  );
};

export default Rating;

const styles = StyleSheet.create({
  countStyle: {
    color: theme.colors.darkTint2,
    marginEnd: 4,
  },
});
