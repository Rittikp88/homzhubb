import React, { ReactElement } from 'react';
import { Text as RNText, StyleSheet, TextProps, StyleProp, TextStyle } from 'react-native';
import { FontUtils } from '@homzhub/common/src/utils/FontUtils';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';

export type TextSizeType = 'small' | 'regular' | 'large';
export type FontWeightType = 'light' | 'regular' | 'semiBold' | 'bold' | 'extraBold';

interface IStyle {
  labelSmall: TextStyle;
  labelRegular: TextStyle;
  textSmall: TextStyle;
  textRegular: TextStyle;
  textLarge: TextStyle;
}

const styles: IStyle = StyleSheet.create<IStyle>({
  labelSmall: {
    fontSize: I18nService.select<number>({
      rtl: 10,
      ltr: 10,
    }),
    lineHeight: 15,
    textAlign: 'left',
  },
  labelRegular: {
    fontSize: I18nService.select<number>({
      rtl: 12,
      ltr: 12,
    }),
    lineHeight: 18,
    textAlign: 'left',
  },
  textSmall: {
    fontSize: I18nService.select<number>({
      rtl: 24,
      ltr: 24,
    }),
    lineHeight: 24,
    textAlign: 'left',
  },
  textRegular: {
    fontSize: I18nService.select<number>({
      rtl: 30,
      ltr: 30,
    }),
    lineHeight: 30,
    textAlign: 'left',
  },
  textLarge: {
    fontSize: I18nService.select<number>({
      rtl: 32,
      ltr: 32,
    }),
    lineHeight: 32,
    textAlign: 'left',
  },
});

interface IProps extends TextProps {
  children: string | React.ReactNode;
  type: TextSizeType;
  textType?: FontWeightType;
}

const Label = ({ type, style, children, textType, ...props }: IProps): ReactElement<RNText> => {
  let defaultStyle: object = {};
  const fontStyle: StyleProp<TextStyle> = FontUtils.chooseFontStyle({ fontType: textType });
  switch (type) {
    case 'small':
      defaultStyle = styles.labelSmall;
      break;
    case 'regular':
      defaultStyle = styles.labelRegular;
      break;
    default:
      defaultStyle = styles.labelSmall;
      break;
  }
  return (
    <RNText style={[defaultStyle, fontStyle, style]} {...props}>
      {children}
    </RNText>
  );
};

const Text = ({ type, style, children, textType, ...props }: IProps): ReactElement<RNText> => {
  let defaultStyle: object = {};
  const fontStyle: StyleProp<TextStyle> = FontUtils.chooseFontStyle({ fontType: textType });
  switch (type) {
    case 'small':
      defaultStyle = styles.textSmall;
      break;
    case 'regular':
      defaultStyle = styles.textRegular;
      break;
    case 'large':
      defaultStyle = styles.textLarge;
      break;
    default:
      defaultStyle = styles.textSmall;
      break;
  }
  return (
    <RNText style={[defaultStyle, fontStyle, style]} {...props}>
      {children}
    </RNText>
  );
};

export { Label, Text };
