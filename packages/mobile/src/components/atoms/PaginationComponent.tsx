import React from 'react';
import { Pagination } from 'react-native-snap-carousel';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';

interface IPaginationProps {
  dotsLength: number;
  activeSlide: number;
  containerStyle?: StyleProp<ViewStyle>;
  activeDotStyle?: StyleProp<ViewStyle>;
  inactiveDotStyle?: StyleProp<ViewStyle>;
}

export const PaginationComponent = (props: IPaginationProps): React.ReactElement => {
  const { dotsLength, activeSlide, containerStyle, inactiveDotStyle, activeDotStyle } = props;
  return (
    <Pagination
      dotsLength={dotsLength}
      activeDotIndex={activeSlide}
      dotStyle={[styles.dotStyle, activeDotStyle]}
      inactiveDotStyle={[styles.inactiveDotStyle, inactiveDotStyle]}
      inactiveDotOpacity={1}
      inactiveDotScale={1}
      containerStyle={containerStyle}
    />
  );
};

const styles = StyleSheet.create({
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
    borderColor: theme.colors.blue,
    borderStyle: 'solid',
    borderWidth: 3,
    backgroundColor: theme.colors.white,
  },
  inactiveDotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
    backgroundColor: theme.colors.blue,
  },
});
