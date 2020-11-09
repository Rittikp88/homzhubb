import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

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

export const randomHex = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
