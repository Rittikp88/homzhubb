import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Button } from '@homzhub/common/src/components';

interface IProps {
  onBtnClick: (updateIndexBy: number) => void;
}

export const NextPrevBtn: FC<IProps> = ({ onBtnClick }: IProps) => {
  const onPrevBtnClick = (): void => {
    onBtnClick(-1);
  };
  const onNextBtnClick = (): void => {
    onBtnClick(1);
  };
  return (
    <>
      <Button
        type="secondary"
        icon={icons.leftArrow}
        iconSize={18}
        iconColor={theme.colors.primaryColor}
        containerStyle={styles.nextBtn}
        onPress={onPrevBtnClick}
      />
      <Button
        type="secondary"
        icon={icons.rightArrow}
        iconSize={18}
        iconColor={theme.colors.primaryColor}
        containerStyle={styles.nextBtn}
        onPress={onNextBtnClick}
      />
    </>
  );
};

const styles = StyleSheet.create({
  nextBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 24,
    border: 'none',
    marginLeft: 8,
    backgroundColor: theme.colors.lightGrayishBlue,
  },
});
