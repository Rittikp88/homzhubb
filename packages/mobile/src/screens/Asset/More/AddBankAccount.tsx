import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import AddBankAccountForm from '@homzhub/common/src/components/organisms/AddBankAccountForm';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';

const AddBankAccount = (): React.ReactElement => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const { id } = useSelector(UserSelector.getUserProfile);
  const { owner: ownerId } = useSelector(FinancialSelectors.getReminderFormData);
  const [isLoading, setLoading] = useState(false);

  const userId = ownerId > 0 ? ownerId : id;

  return (
    <Screen
      backgroundColor={theme.colors.white}
      headerProps={{ title: t('assetFinancial:addBankAccount'), type: 'secondary', onIconPress: goBack }}
      containerStyle={styles.container}
      isLoading={isLoading}
    >
      <View style={styles.infoTextContainer}>
        <Icon name={icons.roundFilled} color={theme.colors.infoBlack} style={styles.dotIcon} size={7} />
        <Label type="small" style={styles.infoText}>
          {t('common:featureInIndiaOnly')}
        </Label>
      </View>
      <AddBankAccountForm onSubmit={goBack} userId={userId} setLoading={setLoading} />
    </Screen>
  );
};

export default AddBankAccount;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  dotIcon: {
    marginEnd: 7,
  },
  infoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    color: theme.colors.infoBlack,
  },
});
