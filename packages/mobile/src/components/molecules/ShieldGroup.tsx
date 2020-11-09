import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, StyleProp, TextStyle } from 'react-native';
// @ts-ignore
import Markdown from 'react-native-easy-markdown';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text, AmenitiesShieldIconGroup } from '@homzhub/common/src/components';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';

interface IProps {
  propertyType?: string;
  text?: string;
  isInfoRequired?: boolean;
  propertyTypeStyle?: StyleProp<TextStyle>;
}

// TODO: (Shikha) - Need to add proper bottom - sheet data once api integrate

const ShieldGroup = ({ propertyType, text, isInfoRequired, propertyTypeStyle }: IProps): React.ReactElement => {
  const [isVisible, setVisible] = useState(false);

  const handleInfo = (): void => {
    setVisible(isInfoRequired ? !isVisible : false);
  };
  const handleClose = (): void => {
    setVisible(false);
  };
  const customStyle = customizedStyles(!!propertyType);
  return (
    <View style={customStyle.container}>
      {!!propertyType && (
        <Text type="small" textType="regular" style={[styles.propertyTypeText, propertyTypeStyle]}>
          {propertyType}
        </Text>
      )}
      <AmenitiesShieldIconGroup onBadgePress={handleInfo} iconSize={23} />
      <BottomSheet
        visible={isVisible}
        onCloseSheet={handleClose}
        headerTitle="Shield Status"
        isShadowView
        sheetHeight={500}
      >
        <ScrollView style={styles.flexOne}>
          <View style={styles.markdownText}>
            <Markdown>{text}</Markdown>
          </View>
        </ScrollView>
      </BottomSheet>
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

const customizedStyles = (isWithText: boolean): any => ({
  container: {
    flexDirection: isWithText ? 'row' : 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
});
