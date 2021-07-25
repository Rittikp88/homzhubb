import React, { useCallback } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import ReminderCard from '@homzhub/common/src/components/molecules/ReminderCard';
import SectionContainer from '@homzhub/common/src/components/organisms/SectionContainer';
import { Reminder } from '@homzhub/common/src/domain/models/Reminder';

const RemindersContainer = (): React.ReactElement | null => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const reminders = useSelector(FinancialSelectors.getReminders);

  // Todo (Praharsh) : Try moving to onFocusCallback
  useFocusEffect(
    useCallback(() => {
      dispatch(FinancialActions.getReminders());
    }, [])
  );

  const keyExtractor = (item: Reminder): string => `${item.id}`;

  const renderItem = ({ item }: { item: Reminder }): React.ReactElement => <ReminderCard reminder={item} />;

  const itemSeparator = (): React.ReactElement => <Divider containerStyles={styles.divider} />;

  if (!reminders.length) return null;

  // Sort array in ascending order based on 'next_reminder_date' to show upcoming at first
  const sortedReminders = DateUtils.ascendingDateSort(reminders, 'nextReminderDate');

  return (
    <SectionContainer
      sectionTitle={t('assetFinancial:reminders')}
      sectionIcon={icons.reminder}
      containerStyle={styles.container}
    >
      <FlatList
        data={sortedReminders}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        scrollEnabled={false}
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
