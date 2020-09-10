import React from 'react';
import { TouchableOpacity, View, StyleSheet, StyleProp, ViewStyle, PickerItemProps } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Text } from '@homzhub/common/src/components/atoms/Text';

interface IListItemProps {
  listItem: PickerItemProps;
  isCheck: boolean;
  onItemSelect?: () => void;
  listItemViewStyle?: StyleProp<ViewStyle>;
  itemContentStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export const ListItem = (props: IListItemProps): React.ReactElement => {
  const { listItem, onItemSelect, isCheck, listItemViewStyle, itemContentStyle, testID } = props;
  return (
    <View style={[styles.listItemView, listItemViewStyle]}>
      <TouchableOpacity style={[styles.itemContent, itemContentStyle]} onPress={onItemSelect} testID={testID}>
        <Text type="small" textType="regular" style={styles.item}>
          {listItem.label}
        </Text>
        {isCheck && <Icon name={icons.checkFilled} size={16} color={theme.colors.primaryColor} />}
      </TouchableOpacity>
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
