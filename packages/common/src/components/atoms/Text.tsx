import React, { ReactElement } from 'react';
import { Text as RNText, StyleSheet, TextProps, StyleProp, TextStyle } from 'react-native';
import { FontUtils } from '@homzhub/common/src/utils/FontUtils';
import { I18nService } from '@homzhub/common/src/services/Localization/i18nextService';

export type TextFieldType = 'label' | 'text' | 'title';
export type TextSizeType = 'small' | 'regular' | 'large';
export type FontWeightType = 'light' | 'regular' | 'semiBold' | 'bold' | 'extraBold';

interface IStyle {
  labelSmall: TextStyle;
  labelRegular: TextStyle;
  labelLarge: TextStyle;
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
  labelLarge: {
    fontSize: I18nService.select<number>({
      rtl: 14,
      ltr: 14,
    }),
    lineHeight: 22,
    textAlign: 'left',
  },
  textSmall: {
    fontSize: I18nService.select<number>({
      rtl: 16,
      ltr: 16,
    }),
    lineHeight: 24,
    textAlign: 'left',
  },
  textRegular: {
    fontSize: I18nService.select<number>({
      rtl: 20,
      ltr: 20,
    }),
    lineHeight: 30,
    textAlign: 'left',
  },
  textLarge: {
    fontSize: I18nService.select<number>({
      rtl: 24,
      ltr: 24,
    }),
    lineHeight: 24,
    textAlign: 'left',
  },
});

interface IProps extends TextProps {
  children: string | React.ReactNode;
  type: TextSizeType;
  textType?: FontWeightType;
  testID?: string;
}

const Label = ({ type, style, children, textType, testID, ...props }: IProps): ReactElement<RNText> => {
  let defaultStyle: object = {};
  const fontStyle: StyleProp<TextStyle> = FontUtils.chooseFontStyle({ fontType: textType });
  switch (type) {
    case 'large':
      defaultStyle = styles.labelLarge;
      break;
    case 'regular':
      defaultStyle = styles.labelRegular;
      break;
    case 'small':
    default:
      defaultStyle = styles.labelSmall;
      break;
  }
  return (
    <RNText style={[defaultStyle, fontStyle, style]} {...props} testID={testID}>
      {children}
    </RNText>
  );
};

const Text = ({ type, style, children, textType, testID, ...props }: IProps): ReactElement<RNText> => {
  let defaultStyle: object = {};
  const fontStyle: StyleProp<TextStyle> = FontUtils.chooseFontStyle({ fontType: textType });
  switch (type) {
    case 'regular':
      defaultStyle = styles.textRegular;
      break;
    case 'large':
      defaultStyle = styles.textLarge;
      break;
    case 'small':
    default:
      defaultStyle = styles.textSmall;
      break;
  }
  return (
    <RNText style={[defaultStyle, fontStyle, style]} {...props} testID={testID}>
      {children}
    </RNText>
  );
};

export { Label, Text };
