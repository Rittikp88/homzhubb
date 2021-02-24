import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';

export interface IMenu {
  icon?: string;
  label: string;
  value: string;
}

interface IProps {
  isVisible: boolean;
  data: IMenu[];
  onSelect: (value: string) => void;
}

const DropdownModal = (props: IProps): React.ReactElement | null => {
  const { data, isVisible, onSelect } = props;
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        return (
          <TouchableOpacity onPress={(): void => onSelect(item.value)} key={index} style={styles.content}>
            {!!item.icon && <Icon name={item.icon} size={20} color={theme.colors.darkTint3} style={styles.iconStyle} />}
            <Text type="small" style={styles.label}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default DropdownModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 12,
    width: 170,
    position: 'absolute',
    top: theme.viewport.width > 350 ? '18%' : '32%', // TODO: Make it more reusable
    right: 14,
    borderRadius: 4,
    shadowColor: theme.colors.boxShadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4.65,
    elevation: 7,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    color: theme.colors.darkTint3,
  },
  iconStyle: {
    marginRight: 6,
  },
});
