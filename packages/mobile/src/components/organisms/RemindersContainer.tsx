import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import ReminderCard from '@homzhub/common/src/components/molecules/ReminderCard';
import SectionContainer from '@homzhub/common/src/components/organisms/SectionContainer';
import { Reminder } from '@homzhub/common/src/domain/models/Reminder';
import { reminder } from '@homzhub/common/src/constants/Reminders';

const RemindersContainer = (): React.ReactElement | null => {
  const { t } = useTranslation();

  // Todo (Praharsh) : Remove mock after API integration
  const mockReminders: Reminder[] = ObjectMapper.deserializeArray(Reminder, Array(3).fill(reminder));

  const keyExtractor = (item: Reminder): string => `${item.id}`;

  const renderItem = ({ item }: { item: Reminder }): React.ReactElement => <ReminderCard reminder={item} />;

  const itemSeparator = (): React.ReactElement => <Divider containerStyles={styles.divider} />;

  if (!mockReminders.length) return null;
  return (
    <SectionContainer
      sectionTitle={t('assetFinancial:reminders')}
      sectionIcon={icons.reminder}
      containerStyle={styles.container}
    >
      <FlatList
        data={mockReminders}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={itemSeparator}
      />
    </SectionContainer>
  );
};

export default React.memo(RemindersContainer);

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: theme.colors.white,
  },
  divider: {
    marginVertical: 8,
  },
});
