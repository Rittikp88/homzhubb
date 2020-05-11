import { Dimensions } from 'react-native';

const defaultHeight = Dimensions.get('window').height;
const defaultWidth = Dimensions.get('window').width;

export const viewport = {
  width: defaultWidth,
  height: defaultHeight,
  dividerWidth: defaultWidth - 40,
  dividerHeight: 1,
};
