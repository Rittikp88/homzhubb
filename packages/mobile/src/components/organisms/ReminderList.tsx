import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { theme } from '@homzhub/common/src/styles/theme';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import ReminderCard from '@homzhub/common/src/components/molecules/ReminderCard';
import { Reminder } from '@homzhub/common/src/domain/models/Reminder';

interface IProps {
  list: Reminder[];
}

const ReminderList = ({ list }: IProps): React.ReactElement => {
  const keyExtractor = (item: Reminder): string => `${item.id}`;

  const renderItem = ({ item }: { item: Reminder }): React.ReactElement => <ReminderCard reminder={item} />;

  const itemSeparator = (): React.ReactElement => <Divider containerStyles={styles.divider} />;

  return (
    <FlatList
      data={list}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      scrollEnabled={false}
      ItemSeparatorComponent={itemSeparator}
    />
  );
};

export default ReminderList;

const styles = StyleSheet.create({
  divider: {
    marginVertical: 8,
    borderColor: theme.colors.background,
    borderWidth: 1,
  },
});
