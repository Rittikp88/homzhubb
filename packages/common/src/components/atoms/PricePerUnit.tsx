import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { CurrencyUtils } from '@homzhub/common/src/utils/CurrencyUtils';
import { FontWeightType, Label, Text, TextSizeType } from '@homzhub/common/src/components/atoms/Text';
import { Currency } from '@homzhub/common/src/domain/models/Currency';

interface IProps {
  price: number;
  prefixText?: string;
  unit?: string;
  currency: Currency;
  priceTransformation?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  textSizeType?: TextSizeType;
  textFontWeight?: FontWeightType;
  textStyle?: StyleProp<TextStyle>;
}

export const PricePerUnit = (props: IProps): React.ReactElement => {
  const {
    price,
    prefixText,
    unit = '',
    currency,
    priceTransformation = true,
    labelStyle,
    textStyle,
    textSizeType = 'regular',
    textFontWeight = 'semiBold',
  } = props;

  // TODO (27/10/2020): Clear up the below code to take the currency data from the Currency model and not from hardcoded data
  const transformedPrice = priceTransformation
    ? CurrencyUtils.getCurrency(currency.currencyCode ?? currency, price)
    : price;
  const priceWithCurrency = `${currency.currencySymbol ?? currency === 'INR' ? '₹' : '$'} ${transformedPrice}`;

  const renderLabel = (): React.ReactElement => {
    return (
      <Label type="large" textType="regular" style={labelStyle} minimumFontScale={0.5} adjustsFontSizeToFit>
        / {unit}
      </Label>
    );
  };

  return (
    <Text type={textSizeType} textType={textFontWeight} style={textStyle} minimumFontScale={0.5} adjustsFontSizeToFit>
      {prefixText ? `${prefixText} ${priceWithCurrency}` : priceWithCurrency}
      {unit.length > 0 && renderLabel()}
    </Text>
  );
};
