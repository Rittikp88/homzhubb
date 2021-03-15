import React, { useState } from 'react';
import { StyleSheet, View, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { AmenitiesShieldIconGroup } from '@homzhub/common/src/components/molecules/AmenitiesShieldIconGroup';

interface IProps {
  propertyType?: string;
  text?: string;
  isInfoRequired?: boolean;
  propertyTypeStyle?: StyleProp<TextStyle>;
}

const ShieldGroup = ({ propertyType, text, isInfoRequired, propertyTypeStyle }: IProps): React.ReactElement => {
  const [isVisible, setVisible] = useState(false);

  const handleInfo = (): void => {
    setVisible(isInfoRequired ? !isVisible : false);
  };

  const customStyle = customizedStyles(!!propertyType);
  const badgeInfo = [
    { color: theme.colors.warning },
    { color: theme.colors.warning },
    { color: theme.colors.disabledPreference },
  ];
  return (
    <View style={customStyle.container}>
      {!!propertyType && (
        <Text type="small" textType="regular" style={[styles.propertyTypeText, propertyTypeStyle]}>
          {propertyType}
        </Text>
      )}
      <AmenitiesShieldIconGroup onBadgePress={handleInfo} iconSize={23} badgesInfo={badgeInfo} />
    </View>
  );
};

export { ShieldGroup };

const styles = StyleSheet.create({
  propertyTypeText: {
    color: theme.colors.primaryColor,
  },
  flexOne: {
    flex: 1,
  },
  markdownText: {
    padding: theme.layout.screenPadding,
  },
});

interface IStyle {
  container: ViewStyle;
}
const customizedStyles = (isWithText: boolean): IStyle => ({
  container: {
    flexDirection: isWithText ? 'row' : 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
});
