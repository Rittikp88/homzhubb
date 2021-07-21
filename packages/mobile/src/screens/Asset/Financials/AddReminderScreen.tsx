import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/core';
import { theme } from '@homzhub/common/src/styles/theme';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import ReminderForm from '@homzhub/common/src/components/organisms/ReminderForm';

const AddReminderScreen = (): React.ReactElement => {
  const { goBack } = useNavigation();
  const { t } = useTranslation();
  return (
    <Screen
      backgroundColor={theme.colors.white}
      headerProps={{ title: t('assetFinancial:addReminders'), type: 'secondary', onIconPress: goBack }}
    >
      <ReminderForm />
    </Screen>
  );
};

export default AddReminderScreen;
