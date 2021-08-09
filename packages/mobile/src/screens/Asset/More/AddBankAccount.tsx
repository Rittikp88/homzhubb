import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import AddBankAccountForm from '@homzhub/common/src/components/organisms/AddBankAccountForm';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';

const AddBankAccount = (): React.ReactElement => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const { params } = useRoute();
  const { id } = useSelector(UserSelector.getUserProfile);
  const [isLoading, setLoading] = useState(false);

  // @ts-ignore
  const userId = params?.userId ?? id;

  return (
    <Screen
      backgroundColor={theme.colors.white}
      headerProps={{ title: t('assetFinancial:addBankAccount'), type: 'secondary', onIconPress: goBack }}
      containerStyle={styles.container}
      isLoading={isLoading}
    >
      <AddBankAccountForm onSubmit={goBack} userId={userId} setLoading={setLoading} />
    </Screen>
  );
};

export default AddBankAccount;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});
