import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { theme } from '@homzhub/common/src/styles/theme';
import AddBankAccountForm from '@homzhub/common/src/components/organisms/AddBankAccountForm';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';

const AddBankAccount = (): React.ReactElement => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();

  return (
    <Screen
      backgroundColor={theme.colors.white}
      headerProps={{ title: t('assetFinancial:addBankAccount'), type: 'secondary', onIconPress: goBack }}
      containerStyle={styles.container}
    >
      <AddBankAccountForm onSubmit={FunctionUtils.noop} />
    </Screen>
  );
};

export default AddBankAccount;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});
