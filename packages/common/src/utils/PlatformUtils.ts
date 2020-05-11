import { Platform } from 'react-native';

const isAndroid = (): boolean => {
  return Platform.OS === 'android';
};

const isIOS = (): boolean => {
  return Platform.OS === 'ios';
};

const isWeb = (): boolean => {
  return Platform.OS === 'web';
};

const isMobile = (): boolean => {
  return isAndroid() || isIOS();
};

export const PlatformUtils = {
  isAndroid,
  isIOS,
  isWeb,
  isMobile,
};
