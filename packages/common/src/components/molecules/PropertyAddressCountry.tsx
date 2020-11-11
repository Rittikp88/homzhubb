import React from 'react';
import { Image, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { ITypographyProps, Typography } from '@homzhub/common/src/components/atoms/Typography';

interface IProps {
  primaryAddress: string;
  subAddress: string;
  countryFlag: string;
  primaryAddressTextStyles?: ITypographyProps;
  subAddressTextStyles?: ITypographyProps;
  primaryAddressStyle?: StyleProp<TextStyle>;
  subAddressStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const PropertyAddressCountry = (props: IProps): React.ReactElement => {
  const {
    primaryAddress,
    subAddress,
    primaryAddressTextStyles,
    subAddressTextStyles,
    primaryAddressStyle,
    subAddressStyle,
    containerStyle = {},
    countryFlag,
  } = props;
  return (
    <View style={[styles.propertyAddressContainer, containerStyle]}>
      <View style={styles.flexRow}>
        <Image source={{ uri: countryFlag }} style={styles.flagStyle} />
        <Typography
          variant={primaryAddressTextStyles?.variant ?? 'text'}
          size={primaryAddressTextStyles?.size ?? 'regular'}
          fontWeight={primaryAddressTextStyles?.fontWeight ?? 'semiBold'}
          style={[styles.propertyNameText, primaryAddressStyle]}
          numberOfLines={1}
        >
          {primaryAddress}
        </Typography>
      </View>
      <Typography
        variant={subAddressTextStyles?.variant ?? 'text'}
        size={subAddressTextStyles?.size ?? 'small'}
        fontWeight={subAddressTextStyles?.fontWeight ?? 'regular'}
        style={[styles.subAddress, subAddressStyle]}
        numberOfLines={2}
      >
        {subAddress}
      </Typography>
    </View>
  );
};

export { PropertyAddressCountry };

const styles = StyleSheet.create({
  propertyAddressContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  propertyNameText: {
    color: theme.colors.shadow,
    width: (theme.viewport.width - 10) / 1.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subAddress: {
    color: theme.colors.darkTint3,
    marginVertical: 6,
  },
  flagStyle: {
    borderRadius: 2,
    width: 24,
    height: 24,
  },
});
