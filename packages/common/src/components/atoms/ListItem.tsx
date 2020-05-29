import React from 'react';
import { TouchableOpacity, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon from '@homzhub/common/src/assets/icon';
import Divider from '@homzhub/common/src/components/atoms/Divider';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IListItemProps {
  listItem: any;
  isCheck: boolean;
  onItemSelect?: () => void;
  listItemViewStyle?: StyleProp<ViewStyle>;
  itemContentStyle?: StyleProp<ViewStyle>;
}

export const ListItem = (props: IListItemProps): React.ReactElement => {
  const { listItem, onItemSelect, isCheck, listItemViewStyle, itemContentStyle } = props;
  return (
    <View style={[styles.listItemView, listItemViewStyle]}>
      <TouchableOpacity style={[styles.itemContent, itemContentStyle]} onPress={onItemSelect}>
        <Text type="small" style={styles.item}>
          {listItem.label}
        </Text>
        {isCheck && <Icon name="check" size={16} color={theme.colors.primaryColor} />}
      </TouchableOpacity>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  listItemView: {
    marginHorizontal: 26,
  },
  item: {
    paddingVertical: 16,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
