import { theme } from '@homzhub/common/src/styles/theme';
import { StyleProp, TextStyle } from 'react-native';

interface IChooseFontStyleParams {
  fontType?: 'light' | 'regular' | 'semiBold' | 'bold' | 'extraBold';
}

class FontUtils {
  public chooseFontStyle = ({ fontType }: IChooseFontStyleParams): StyleProp<TextStyle> => {
    const { light, regular, semiBold, bold, extraBold } = theme.font.fontStyle;
    if (!fontType) {
      return regular;
    }
    switch (fontType) {
      case 'light':
        return light;
      case 'regular':
        return regular;
      case 'semiBold':
        return semiBold;
      case 'bold':
        return bold;
      case 'extraBold':
        return extraBold;
      default:
        return regular;
    }
  };
}

const fontUtils = new FontUtils();
export { fontUtils as FontUtils };
