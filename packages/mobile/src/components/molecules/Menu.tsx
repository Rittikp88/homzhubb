import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';

export interface IMenu {
  icon?: string;
  label: string;
  value: string;
}

interface IProps {
  data: IMenu[];
  optionTitle?: string;
  onSelect: (value: string) => void;
  sheetHeight?: number;
}

const Menu = (props: IProps): React.ReactElement => {
  const { data, onSelect, optionTitle, sheetHeight } = props;
  const [isVisible, setIsVisible] = useState(false);

  const handleSelection = (value: string): void => {
    setIsVisible(false);
    onSelect(value);
  };

  const renderMenuItem = (item: IMenu, index: number): React.ReactElement => {
    return (
      <TouchableOpacity onPress={(): void => handleSelection(item.value)} key={index} style={styles.content}>
        {!!item.icon && <Icon name={item.icon} size={24} color={theme.colors.darkTint3} style={styles.iconStyle} />}
        <Text type="small" style={styles.label}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity onPress={(): void => setIsVisible(!isVisible)}>
        <Icon name={icons.verticalDots} color={theme.colors.primaryColor} size={18} />
      </TouchableOpacity>
      <BottomSheet
        visible={isVisible}
        headerTitle={optionTitle}
        sheetHeight={sheetHeight}
        onCloseSheet={(): void => setIsVisible(false)}
      >
        <>{data.map((item, index) => renderMenuItem(item, index))}</>
      </BottomSheet>
    </>
  );
};

export default Menu;

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
    marginHorizontal: 16,
  },
  label: {
    color: theme.colors.darkTint3,
  },
  iconStyle: {
    marginRight: 6,
  },
});
