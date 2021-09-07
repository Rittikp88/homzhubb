import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { UserSelector } from '@homzhub/common/src/modules/user/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Label } from '@homzhub/common/src/components/atoms/Text';
import AddBankAccountForm from '@homzhub/common/src/components/organisms/AddBankAccountForm';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { IAddBankAccount } from '@homzhub/mobile/src/navigation/interfaces';

const AddBankAccount = (): React.ReactElement => {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const { id } = useSelector(UserSelector.getUserProfile);
  const [isLoading, setLoading] = useState(false);
  const { params } = useRoute();
  const navParams = params as IAddBankAccount;
  const userId = navParams && navParams.id && navParams.id > 0 ? navParams.id : id;

  return (
    <Screen
      backgroundColor={theme.colors.white}
      headerProps={{
        title: navParams?.isEdit ? t('assetFinancial:editDetails') : t('assetFinancial:addBankAccount'),
        type: 'secondary',
        onIconPress: goBack,
      }}
      containerStyle={styles.container}
      isLoading={isLoading}
    >
      <View style={styles.infoTextContainer}>
        <Icon name={icons.roundFilled} color={theme.colors.blackTint2} style={styles.dotIcon} size={7} />
        <Label type="small" style={styles.infoText}>
          {t('common:featureInIndiaOnly')}
        </Label>
      </View>
      <AddBankAccountForm
        isEditFlow={Boolean(navParams?.isEdit)}
        onSubmit={goBack}
        userId={userId}
        setLoading={setLoading}
      />
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
    color: theme.colors.blackTint2,
  },
});
