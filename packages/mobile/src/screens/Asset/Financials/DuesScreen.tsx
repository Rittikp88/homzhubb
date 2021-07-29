import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FinancialActions } from '@homzhub/common/src/modules/financials/actions';
import { FinancialSelectors } from '@homzhub/common/src/modules/financials/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import DueList from '@homzhub/mobile/src/components/organisms/DueList';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';

const DuesScreen = (): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { goBack } = useNavigation();
  const dueItems = useSelector(FinancialSelectors.getDueItems);
  const { dues: dueLoading } = useSelector(FinancialSelectors.getFinancialLoaders);

  useFocusEffect(
    useCallback(() => {
      dispatch(FinancialActions.getDues());
      dispatch(FinancialActions.setCurrentDueId(-1));
    }, [])
  );

  return (
    <Screen
      backgroundColor={theme.colors.white}
      headerProps={{
        title: t('assetDashboard:dues'),
        type: 'secondary',
        onIconPress: goBack,
      }}
      containerStyle={styles.container}
      isLoading={dueLoading}
    >
      <DueList dues={dueItems} />
    </Screen>
  );
};

export default React.memo(DuesScreen);

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
});
