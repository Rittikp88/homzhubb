import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { LedgerRepository } from '@homzhub/common/src/domain/repositories/LedgerRepository';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import ConfirmationSheet from '@homzhub/mobile/src/components/molecules/ConfirmationSheet';
import ReminderForm from '@homzhub/common/src/components/organisms/ReminderForm';
import { IAddReminder, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const AddReminderScreen = (): React.ReactElement => {
  const { goBack, navigate } = useNavigation();
  const { params } = useRoute();
  const { t } = useTranslation();
  const loaders = useSelector(FinancialSelectors.getFinancialLoaders);
  const [isLoading, setLoading] = useState(false);
  const [isSheetVisible, setSheetVisibility] = useState(false);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const selectedReminderId = useSelector(FinancialSelectors.getCurrentReminderId);

  const param = params as IAddReminder;

  const onPressIcon = (visible: boolean): void => {
    setSheetVisibility(visible);
  };

  const onPressDelete = async (): Promise<void> => {
    try {
      await LedgerRepository.deleteReminderById(selectedReminderId);
      goBack();
      onPressIcon(false);
      AlertHelper.success({ message: t('assetFinancial:reminderDeleteMsg') });
    } catch (e) {
      onPressIcon(false);
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
    }
  };

  const handleAddAccount = (): void => {
    navigate(ScreensKeys.AddBankAccount);
  };

  return (
    <>
      <Screen
        backgroundColor={theme.colors.white}
        isLoading={loaders.reminder || isLoading}
        keyboardShouldPersistTaps
        headerProps={{
          title: param?.isEdit ? t('assetFinancial:editReminder') : t('assetFinancial:addReminders'),
          type: 'secondary',
          onIconPress: goBack,
          ...(showDeleteIcon && { iconRight: icons.trash, onIconRightPress: (): void => onPressIcon(true) }),
        }}
      >
        <ReminderForm
          onSubmit={goBack}
          isEdit={param?.isEdit ?? false}
          isFromDues={param?.isFromDues ?? false}
          setLoading={setLoading}
          onAddAccount={handleAddAccount}
          setShowDeleteIcon={setShowDeleteIcon}
        />
      </Screen>
      <ConfirmationSheet
        isVisible={isSheetVisible}
        sheetTitle={t('common:delete')}
        message={t('property:deleteConfirmation', { name: t('assetFinancial:thisReminder') })}
        onCloseSheet={(): void => onPressIcon(false)}
        onPressDelete={onPressDelete}
      />
    </>
  );
};

export default AddReminderScreen;
