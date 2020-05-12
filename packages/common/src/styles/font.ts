import { StyleProp, TextStyle } from 'react-native';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';

export interface IFontStyle {
  regular: StyleProp<TextStyle>;
  medium: StyleProp<TextStyle>;
  bold: StyleProp<TextStyle>;
}

const fontFamilies = {
  english: {
    regular: '',
    medium: '',
    bold: '',
  },
};

const fontStyle: IFontStyle = Object.freeze<IFontStyle>({
  regular: {
    fontFamily: I18nService.select<string>({
      rtl: '',
      ltr: fontFamilies.english.regular,
    }),
  },
  medium: {
    fontFamily: I18nService.select<string>({
      rtl: '',
      ltr: fontFamilies.english.medium,
    }),
    ...I18nService.select<object>({
      rtl: {
        fontWeight: '500',
      },
      ltr: {
        fontWeight: '500',
      },
    }),
  },
  bold: {
    fontFamily: I18nService.select<string>({
      rtl: '',
      ltr: fontFamilies.english.bold,
    }),
  },
});

export const font = {
  fontFamilies,
  fontStyle,
};
