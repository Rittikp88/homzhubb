import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Text } from '@homzhub/common/src/components';
import { BottomSheet } from '@homzhub/mobile/src/components/molecules/BottomSheet';

interface IProps {
  text?: string;
  isInfoRequired?: boolean;
}

// TODO: (Shikha) - Need to add proper bottom - sheet data once api integrate

const ShieldGroup = ({ text, isInfoRequired }: IProps): React.ReactElement => {
  const [isVisible, setVisible] = useState(false);

  const handleInfo = (): void => {
    setVisible(isInfoRequired ? !isVisible : false);
  };
  const handleClose = (): void => {
    setVisible(false);
  };
  const customStyle = customizedStyles(!!text);
  return (
    <View style={customStyle.container}>
      {text && (
        <Text type="small" textType="regular" style={styles.propertyTypeText}>
          {text}
        </Text>
      )}
      <View style={styles.badgesContainer}>
        <Icon name={icons.badge} size={23} color={theme.colors.warning} style={styles.badges} onPress={handleInfo} />
        <Icon name={icons.badge} size={23} color={theme.colors.warning} style={styles.badges} onPress={handleInfo} />
        <Icon
          name={icons.badge}
          size={23}
          color={theme.colors.disabledPreference}
          style={styles.badges}
          onPress={handleInfo}
        />
      </View>
      <BottomSheet
        visible={isVisible}
        onCloseSheet={handleClose}
        headerTitle="Shield Status"
        isShadowView
        sheetHeight={500}
      >
        <Text type="small" textType="regular" style={styles.propertyTypeText}>
          Verified
        </Text>
      </BottomSheet>
    </View>
  );
};

export { ShieldGroup };

const styles = StyleSheet.create({
  badgesContainer: {
    flexDirection: 'row',
  },
  badges: {
    marginHorizontal: 3,
  },
  propertyTypeText: {
    color: theme.colors.primaryColor,
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
