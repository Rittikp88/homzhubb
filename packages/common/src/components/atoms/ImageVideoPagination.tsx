import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';

type SlideTypes = 'image' | 'video';

interface IProps {
  currentSlide: number;
  totalSlides: number;
  type: SlideTypes;
}

const ImageVideoPagination = (props: IProps): React.ReactElement => {
  const { currentSlide, totalSlides, type } = props;
  return (
    <View style={styles.container}>
      <Icon name={icons.camera} size={20} color={type === 'image' ? theme.colors.white : theme.colors.darkTint5} />
      <Icon
        name={icons.video}
        size={20}
        color={type === 'video' ? theme.colors.white : theme.colors.darkTint5}
        style={styles.video}
      />
      <Label type="large" textType="regular" style={styles.label}>
        {' '}
        {currentSlide + 1} / {totalSlides}{' '}
      </Label>
    </View>
  );
};

export { ImageVideoPagination };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.imageVideoPaginationBackground,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 2,
  },
  label: {
    color: theme.colors.white,
  },
  video: {
    paddingHorizontal: 5,
  },
});
