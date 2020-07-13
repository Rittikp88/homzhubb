import React from 'react';
import { StyleSheet, StyleProp, TextStyle } from 'react-native';
import { FontWeightType, Label, Text, TextSizeType } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  price: number;
  label: string;
  prefix: string;
  labelStyle?: StyleProp<TextStyle>;
  textSizeType?: TextSizeType;
  textFontWeight?: FontWeightType;
  textStyle?: StyleProp<TextStyle>;
}

const PricePerUnit = (props: IProps): React.ReactElement => {
  const { price, label, prefix, labelStyle, textStyle, textSizeType = 'regular', textFontWeight = 'semiBold' } = props;

  const priceWithCurrency = `${prefix} ${price.toLocaleString()}`;

  const renderLabel = (): React.ReactElement => {
    return (
      <Label type="large" textType="regular" style={labelStyle}>
        / {label}
      </Label>
    );
  };

  return (
    <Text type={textSizeType} textType={textFontWeight} style={[styles.text, textStyle]}>
      {priceWithCurrency}
      {renderLabel()}
    </Text>
  );
};

export { PricePerUnit };

const styles = StyleSheet.create({
  text: {
    padding: 10,
  },
});
