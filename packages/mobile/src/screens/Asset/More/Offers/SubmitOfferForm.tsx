import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/core';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import OfferForm from '@homzhub/common/src/components/organisms/OfferForm';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const SubmitOfferForm = (): React.ReactElement => {
  const { goBack, navigate } = useNavigation();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const isFocused = useIsFocused();

  // HOOKS START
  const { t } = useTranslation();
  const isRentFlow = !useSelector(AssetSelectors.getAssetListingType);
  // HOOKS END

  // HANDLERS START
  const handleTermsCondition = (): void => {
    navigate(ScreensKeys.WebViewScreen, { url: 'https://www.homzhub.com/privacyPolicy' });
  };

  const onSuccess = (): void => setIsSuccess(true);
  // HANDLERS END

  return (
    <Screen
      scrollEnabled
      backgroundColor={theme.colors.white}
      headerProps={{
        type: 'secondary',
        title: t('offers:submitOffer'),
        onIconPress: goBack,
        testID: 'submitOfferForm',
        ...(isRentFlow && {
          textRight: t('moreProfile:editProfile'),
          // ToDo (Praharsh) : Handle right text onPress logic after linking navigation.
        }),
      }}
      contentContainerStyle={styles.screen}
    >
      {isFocused && <OfferForm onPressTerms={handleTermsCondition} onSuccess={onSuccess} />}
      {isSuccess && (
        <BottomSheet visible={isSuccess} onCloseSheet={goBack} sheetHeight={400}>
          <>
            <View style={styles.bottomSheet}>
              <Text type="large" textType="semiBold">
                {t('offers:offerSucessHeader')}
              </Text>
              <Text type="small" textType="regular" style={styles.subHeader}>
                {t('offers:offerSucessSubHeader')}
              </Text>
              <Icon name={icons.doubleCheck} size={60} color={theme.colors.completed} />
            </View>
            <Button title={t('common:done')} type="primary" containerStyle={styles.doneButton} onPress={onSuccess} />
          </>
        </BottomSheet>
      )}
    </Screen>
  );
};

export default React.memo(SubmitOfferForm);

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  bottomSheet: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeader: {
    marginTop: 10,
    marginBottom: 20,
  },
  doneButton: {
    marginHorizontal: 16,
    marginVertical: 25,
    flex: 1,
  },
});
