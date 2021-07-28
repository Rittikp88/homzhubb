import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { icons } from '@homzhub/common/src/assets/icon';
import { theme } from '@homzhub/common/src/styles/theme';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import ReminderForm from '@homzhub/common/src/components/organisms/ReminderForm';
import { IAddReminder } from '@homzhub/mobile/src/navigation/interfaces';

const AddReminderScreen = (): React.ReactElement => {
  const { goBack } = useNavigation();
  const { params } = useRoute();
  const { t } = useTranslation();
  const loaders = useSelector(FinancialSelectors.getFinancialLoaders);
  const [isLoading, setLoading] = useState(false);
  const param = params as IAddReminder;
  return (
    <Screen
      backgroundColor={theme.colors.white}
      isLoading={loaders.reminder || isLoading}
      keyboardShouldPersistTaps
      headerProps={{
        title: t('assetFinancial:addReminders'),
        type: 'secondary',
        onIconPress: goBack,
        ...(param?.isEdit && { iconRight: icons.trash }),
      }}
    >
      <ReminderForm onSubmit={goBack} isEdit={param?.isEdit ?? false} setLoading={setLoading} />
    </Screen>
  );
};

export default AddReminderScreen;
