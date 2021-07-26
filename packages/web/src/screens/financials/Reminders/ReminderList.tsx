import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, FlatList, LayoutChangeEvent, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { icons } from '@homzhub/common/src/assets/icon';
import ReminderCard from '@homzhub/common/src/components/molecules/ReminderCard';
import SectionContainer from '@homzhub/common/src/components/organisms/SectionContainer';
import { Reminder } from '@homzhub/common/src/domain/models/Reminder';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';

const ReminderList = (): React.ReactElement | null => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const reminders = useSelector(FinancialSelectors.getReminders);
  const [maxWidthItem, setMaxWidthItem] = useState<string | number>('100vw');
  const isDesktop = useOnly(deviceBreakpoint.DESKTOP);

  useEffect(() => {
    dispatch(FinancialActions.getReminders());
  }, []);

  const keyExtractor = (item: Reminder): string => `${item.id}`;
  const customWidth = { maxWidth: maxWidthItem };
  const renderItem = ({ item }: { item: Reminder }): React.ReactElement => (
    <ReminderCard reminder={item} cardContainerStyle={[styles.cardContaner, isDesktop && customWidth]} />
  );

  if (!reminders.length) return null;

  // Sort array in ascending order based on 'next_reminder_date' to show upcoming at first
  const sortedReminders = DateUtils.ascendingDateSort(reminders, 'nextReminderDate');

  const onLayout = (event: LayoutChangeEvent): void => {
    if (isDesktop) {
      const clientWidth = event.nativeEvent.layout.width / 2;
      setMaxWidthItem(clientWidth - 16);
    }
  };

  const itemSeparator = (): React.ReactElement => <View style={{ width: '8px' }} />;

  return (
    <SectionContainer
      sectionTitle={t('assetFinancial:reminders')}
      sectionIcon={icons.reminder}
      containerStyle={styles.container}
    >
      <FlatList
        key={isDesktop ? 'Reminder-List-Col-2' : 'Reminder-List-Col-1'}
        numColumns={isDesktop ? 2 : 1}
        data={sortedReminders}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        scrollEnabled={false}
        onLayout={onLayout}
        ItemSeparatorComponent={itemSeparator}
      />
    </SectionContainer>
  );
};

export default React.memo(ReminderList);

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    backgroundColor: theme.colors.white,
  },
  divider: {
    marginVertical: 8,
  },
  cardContaner: {
    borderColor: theme.colors.darkTint10,
    borderWidth: 1,
    borderStyle: 'solid',
    padding: '1%',
    marginHorizontal: 8,
  },
});
