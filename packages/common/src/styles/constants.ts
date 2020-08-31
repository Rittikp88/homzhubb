// Add commonly used style based strings here to avoid duplication
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@homzhub/common/src/styles/colors';

export const styleConstants = {
  spaceBetween: 'space-between',
  flexStart: 'flex-start',
  flexEnd: 'flex-end',
  center: 'center',
  transparent: 'transparent',
  none: 'none',
};

// Button styles for special cases
export const buttonStyle = StyleSheet.create({
  // use with ButtonType Primary
  error: {
    backgroundColor: colors.highPriority,
  },
  // use with ButtonType Primary
  success: {
    backgroundColor: colors.success,
  },
});

export const globalStyles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const circleCSS = (radius: number): StyleProp<ViewStyle> => ({
  height: radius,
  width: radius,
  borderRadius: radius / 2,
});

export const placeHolderImage =
  'https://www.investopedia.com/thmb/7GOsX_NmY3KrIYoZPWOu6SldNFI=/735x0/houses_and_land-5bfc3326c9e77c0051812eb3.jpg';
