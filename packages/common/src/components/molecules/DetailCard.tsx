import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
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
      <Label type="large" textType="semiBold" style={styles.label}>
        {heading}
      </Label>
      {label && (
        <Label type="large" style={styles.label}>
          {label}
        </Label>
      )}
      {description && (
        <Label type="large" style={styles.label}>
          {description}
        </Label>
      )}
    </View>
  );
};

export default DetailCard;

const styles = StyleSheet.create({
  label: {
    color: theme.colors.darkTint3,
  },
});
