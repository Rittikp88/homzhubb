// Add commonly used style based strings here to avoid duplication
import { StyleSheet } from 'react-native';
import { PlatformUtils } from '@homzhub/common/src/utils/PlatformUtils';
import { colors } from '@homzhub/common/src/styles/colors';

export const styleConstants = {
  spaceBetween: 'space-between',
  flexStart: 'flex-start',
  flexEnd: 'flex-end',
  center: 'center',
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
