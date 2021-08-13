import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Accounting from '@homzhub/common/src/assets/images/accounting.svg';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Divider } from '@homzhub/common/src/components/atoms/Divider';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import DueCard from '@homzhub/common/src/components/molecules/DueCard';
import IconSheet, { ISheetData } from '@homzhub/mobile/src/components/molecules/IconSheet';
import { DueItem } from '@homzhub/common/src/domain/models/DueItem';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

interface IProps {
  dues: DueItem[];
}

const DueList = ({ dues }: IProps): React.ReactElement => {
  // HOOKS START
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const [isSheetVisible, setSheetVisibility] = useState(false);
  const currentDue = useSelector(FinancialSelectors.getCurrentDue);
  // HOOKS END

  const handleAlreadyPaid = (): void => {
    navigate(ScreensKeys.AddRecordScreen, { isFromDues: true });
  };

  const onSetReminder = (): void => {
    if (currentDue && currentDue.canAddReminder) {
      navigate(ScreensKeys.AddReminderScreen, { isFromDues: true });
      return;
    }
    AlertHelper.error({ message: t('assetFinancial:reminderAlreadySetForDue') });
    setSheetVisibility(false);
  };

  const getSheetData = (): ISheetData[] => {
    const iconSize = 40;
    const ImageHOC = (Image: React.FC<SvgProps>): React.ReactElement => <Image width={iconSize} height={iconSize} />;
    const IconHOC = (name: string): React.ReactElement => (
      <Icon name={name} size={iconSize + 3} color={theme.colors.error} />
    );
    return [
      {
        icon: ImageHOC(Accounting),
        label: t('assetFinancial:alreadyPaid'),
        onPress: handleAlreadyPaid,
      },
      {
        icon: IconHOC(icons.reminder),
        label: t('assetFinancial:setReminders'),
        onPress: onSetReminder,
      },
    ];
  };

  const keyExtractor = (item: DueItem): string => item.id.toString();

  const renderItem = ({ item }: { item: DueItem }): React.ReactElement | null => {
    const onPressClose = (dueId?: number): void => {
      if (dueId) {
        dispatch(FinancialActions.setCurrentDueId(dueId));
      }
      setSheetVisibility(true);
    };

    const onPressPayNow = (): void => {
      dispatch(FinancialActions.setCurrentDueId(item.id));
      navigate(ScreensKeys.DuesOrderSummary);
    };

    return <DueCard due={item} onPressClose={onPressClose} onPressPayNow={onPressPayNow} />;
  };

  const itemSeparator = (): React.ReactElement => <Divider containerStyles={styles.divider} />;

  const onCloseSheet = (): void => {
    setSheetVisibility(false);
  };

  return (
    <>
      <FlatList
        data={dues}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        scrollEnabled={false}
        ItemSeparatorComponent={itemSeparator}
        ListEmptyComponent={EmptyState}
      />
      <IconSheet isVisible={isSheetVisible} data={getSheetData()} sheetHeight={250} onCloseSheet={onCloseSheet} />
    </>
  );
};

export default DueList;

const styles = StyleSheet.create({
  divider: {
    marginVertical: 8,
    borderColor: theme.colors.background,
    borderWidth: 1,
  },
});
