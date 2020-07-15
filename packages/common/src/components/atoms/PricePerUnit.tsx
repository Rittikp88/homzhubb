import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { FontWeightType, Label, Text, TextSizeType } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  price: number;
  unit: string;
  currency: string;
  labelStyle?: StyleProp<TextStyle>;
  textSizeType?: TextSizeType;
  textFontWeight?: FontWeightType;
  textStyle?: StyleProp<TextStyle>;
}

const PricePerUnit = (props: IProps): React.ReactElement => {
  const { price, unit, currency, labelStyle, textStyle, textSizeType = 'regular', textFontWeight = 'semiBold' } = props;

  const priceWithCurrency = `${currency}${price.toLocaleString()}`;

  const renderLabel = (): React.ReactElement => {
    return (
      <Label type="large" textType="regular" style={labelStyle}>
        / {unit}
      </Label>
    );
  };

  return (
    <Text type={textSizeType} textType={textFontWeight} style={textStyle}>
      {priceWithCurrency}
      {renderLabel()}
    </Text>
  );
};

export { PricePerUnit };
