import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/core';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import ReminderForm from '@homzhub/common/src/components/organisms/ReminderForm';

const AddReminderScreen = (): React.ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation();
  const loaders = useSelector(FinancialSelectors.getFinancialLoaders);
  return (
    <Screen
      backgroundColor={theme.colors.white}
      isLoading={loaders.reminder}
      headerProps={{ title: t('assetFinancial:addReminders'), type: 'secondary', onIconPress: goBack }}
    >
      <ReminderForm onSubmit={goBack} />
    </Screen>
  );
};

export default AddReminderScreen;
