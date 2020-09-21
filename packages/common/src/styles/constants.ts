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

// TODO: This needs to be removed
export const placeHolderImage =
  'https://www.investopedia.com/thmb/7GOsX_NmY3KrIYoZPWOu6SldNFI=/735x0/houses_and_land-5bfc3326c9e77c0051812eb3.jpg';

export const randomHex = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
