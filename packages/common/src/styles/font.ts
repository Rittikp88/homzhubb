import { StyleProp, TextStyle } from 'react-native';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';

export interface IFontStyle {
  light: StyleProp<TextStyle>;
  regular: StyleProp<TextStyle>;
  semiBold: StyleProp<TextStyle>;
  bold: StyleProp<TextStyle>;
  extraBold: StyleProp<TextStyle>;
}

const fontFamilies = {
  english: {
    light: 'OpenSans-Light',
    regular: 'OpenSans-Regular',
    semiBold: 'OpenSans-SemiBold',
    bold: 'OpenSans-Bold',
    extraBold: 'OpenSans-ExtraBold',
  },
};

const fontStyle: IFontStyle = Object.freeze<IFontStyle>({
  light: {
    fontFamily: I18nService.select<string>({
      rtl: fontFamilies.english.light,
      ltr: fontFamilies.english.light,
    }),
    ...I18nService.select<object>({
      rtl: {
        fontWeight: '300',
      },
      ltr: {
        fontWeight: '300',
      },
    }),
  },
  regular: {
    fontFamily: I18nService.select<string>({
      rtl: fontFamilies.english.regular,
      ltr: fontFamilies.english.regular,
    }),
    ...I18nService.select<object>({
      rtl: {
        fontWeight: '400',
      },
      ltr: {
        fontWeight: '400',
      },
    }),
  },
  semiBold: {
    fontFamily: I18nService.select<string>({
      rtl: fontFamilies.english.semiBold,
      ltr: fontFamilies.english.semiBold,
    }),
    ...I18nService.select<object>({
      rtl: {
        fontWeight: '600',
      },
      ltr: {
        fontWeight: '600',
      },
    }),
  },
  bold: {
    fontFamily: I18nService.select<string>({
      rtl: fontFamilies.english.bold,
      ltr: fontFamilies.english.bold,
    }),
    ...I18nService.select<object>({
      rtl: {
        fontWeight: '700',
      },
      ltr: {
        fontWeight: '700',
      },
    }),
  },
  extraBold: {
    fontFamily: I18nService.select<string>({
      rtl: fontFamilies.english.extraBold,
      ltr: fontFamilies.english.extraBold,
    }),
    ...I18nService.select<object>({
      rtl: {
        fontWeight: '800',
      },
      ltr: {
        fontWeight: '800',
      },
    }),
  },
});

export const font = {
  fontFamilies,
  fontStyle,
};
