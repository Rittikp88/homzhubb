import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import TransactionCardsContainer from '@homzhub/mobile/src/components/organisms/TransactionCardsContainer';
import { ICommonNavProps, ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const AssetFinancial = (): React.ReactElement => {
  const { params } = useRoute();
  const { t } = useTranslation();
  const { navigate, goBack } = useNavigation();
  const param = params as ICommonNavProps;

  const onRecordAdd = (): void => {
    navigate(ScreensKeys.AddRecordScreen, { assetId: param.propertyId, screenTitle: param.screenTitle });
  };

  return (
    <UserScreen
      title={param?.screenTitle ?? t('assetPortfolio:portfolio')}
      pageTitle={t('assetFinancial:financial')}
      onBackPress={goBack}
    >
      <View style={styles.container}>
        <Button
          type="secondary"
          title={t('assetFinancial:addNewRecord')}
          containerStyle={styles.addRecordButton}
          onPress={onRecordAdd}
        />
        <TransactionCardsContainer selectedProperty={param.propertyId} isFromPortfolio={param?.isFromPortfolio} />
      </View>
    </UserScreen>
  );
};

export default AssetFinancial;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  addRecordButton: {
    flex: 0,
    marginTop: 16,
    borderStyle: 'dashed',
  },
});
