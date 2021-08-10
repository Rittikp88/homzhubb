import React from 'react';
import { View } from 'react-native';
import { Label } from '@homzhub/common/src/components/atoms/Text';

export interface ICardProp extends IOwnProps {
  value: number;
  selectedValue: string;
}

export interface IOwnProps {
  heading: string;
  label?: string;
  description?: string;
}

const DetailCard = (props: IOwnProps): React.ReactElement => {
  const { heading, label, description } = props;
  return (
    <View>
      <Label type="large" textType="semiBold">
        {heading}
      </Label>
      {label && <Label type="large">{label}</Label>}
      {description && <Label type="large">{description}</Label>}
    </View>
  );
};

export default DetailCard;
