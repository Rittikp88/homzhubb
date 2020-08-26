import React from 'react';
import { StyleSheet, View, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { images } from '@homzhub/common/src/assets/images';
import { theme } from '@homzhub/common/src/styles/theme';
import { Image, Text } from '@homzhub/common/src/components';

interface IProps {
  primaryAddress: string;
  subAddress: string;
  primaryAddressStyle?: StyleProp<TextStyle>;
  subAddressStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const PropertyAddressCountry = (props: IProps): React.ReactElement => {
  const { primaryAddress, subAddress, primaryAddressStyle, subAddressStyle, containerStyle = {} } = props;
  return (
    <View style={[styles.propertyAddressContainer, containerStyle]}>
      <View style={styles.flexRow}>
        <Image source={images.flag} />
        <Text
          type="regular"
          textType="semiBold"
          style={[styles.propertyNameText, primaryAddressStyle]}
          numberOfLines={1}
        >
          {primaryAddress}
        </Text>
      </View>
      <Text type="small" textType="regular" style={[styles.subAddress, subAddressStyle]}>
        {subAddress}
      </Text>
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
});
