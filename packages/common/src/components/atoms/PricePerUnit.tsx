import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { CurrencyUtils } from '@homzhub/common/src/utils/CurrencyUtils';
import { FontWeightType, Label, Text, TextSizeType } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  price: number;
  unit?: string;
  currency: string;
  priceTransformation?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  textSizeType?: TextSizeType;
  textFontWeight?: FontWeightType;
  textStyle?: StyleProp<TextStyle>;
}

const PricePerUnit = (props: IProps): React.ReactElement => {
  const {
    price,
    unit = '',
    currency,
    priceTransformation = true,
    labelStyle,
    textStyle,
    textSizeType = 'regular',
    textFontWeight = 'semiBold',
  } = props;
  const transformedPrice = priceTransformation ? CurrencyUtils.getCurrency(currency, price) : price;
  const prefix = currency === 'INR' ? '₹' : '$';
  const priceWithCurrency = `${prefix} ${transformedPrice}`;

  const renderLabel = (): React.ReactElement => {
    return (
      <Label type="large" textType="regular" style={labelStyle} minimumFontScale={0.5} adjustsFontSizeToFit>
        / {unit}
      </Label>
    );
  };

  return (
    <Text type={textSizeType} textType={textFontWeight} style={textStyle} minimumFontScale={0.5} adjustsFontSizeToFit>
      {priceWithCurrency}
      {unit.length > 0 && renderLabel()}
    </Text>
  );
};

export { PricePerUnit };
