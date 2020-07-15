import React from 'react';
import { StyleSheet, View, StyleProp, TextStyle } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text, Label } from '@homzhub/common/src/components/atoms/Text';

interface IProps {
  primaryAddress: string;
  subAddress: string;
  primaryAddressStyle?: StyleProp<TextStyle>;
  subAddressStyle?: StyleProp<TextStyle>;
}

const PropertyAddress = (props: IProps): React.ReactElement => {
  const { primaryAddress, subAddress, primaryAddressStyle, subAddressStyle } = props;
  return (
    <View style={styles.propertyAddressContainer}>
      <Text type="regular" textType="semiBold" style={[styles.propertyNameText, primaryAddressStyle]}>
        {primaryAddress}
      </Text>
      <View style={styles.flexRow}>
        <Icon name={icons.locationMarker} size={25} color={theme.colors.darkTint3} />
        <Label type="large" textType="regular" style={[styles.subAddress, subAddressStyle]}>
          {subAddress}
        </Label>
      </View>
    </View>
  );
};

export { PropertyAddress };

const styles = StyleSheet.create({
  propertyAddressContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  propertyNameText: {
    color: theme.colors.shadow,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subAddress: {
    color: theme.colors.darkTint3,
    marginVertical: 6,
    marginHorizontal: 10,
  },
});
