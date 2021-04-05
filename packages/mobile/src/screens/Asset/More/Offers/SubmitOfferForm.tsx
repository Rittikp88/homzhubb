import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/core';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { AnalyticsHelper } from '@homzhub/common/src/utils/AnalyticsHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { AnalyticsService } from '@homzhub/common/src/services/Analytics/AnalyticsService';
import { EventType } from '@homzhub/common/src/services/Analytics/EventType';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import Icon, { icons } from '@homzhub/common/src/assets/icon';
import { Button } from '@homzhub/common/src/components/atoms/Button';
import { Text } from '@homzhub/common/src/components/atoms/Text';
import { BottomSheet } from '@homzhub/common/src/components/molecules/BottomSheet';
import OfferForm from '@homzhub/common/src/components/organisms/OfferForm';
import { Screen } from '@homzhub/mobile/src/components/HOC/Screen';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { IOfferManagementParam } from '@homzhub/common/src/domain/repositories/interfaces';

const SubmitOfferForm = (): React.ReactElement => {
  const { goBack, navigate } = useNavigation();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const isFocused = useIsFocused();

  // HOOKS START
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isCounterFlow = useSelector(OfferSelectors.getCurrentOffer);
  const asset = useSelector(OfferSelectors.getListingDetail);
  const isRentFlow = asset?.isLeaseListing;
  const [loading, setLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    let param: IOfferManagementParam;
    if (asset) {
      param = {
        ...(asset.leaseTerm && { lease_listing_id: asset.leaseTerm.id }),
        ...(asset.saleTerm && { sale_listing_id: asset.saleTerm.id }),
      };
    }
    const getOfferCount = async (): Promise<void> => {
      try {
        setLoading(true);
        const {
          offerLeft: { sale, lease },
        } = await OffersRepository.getOfferData(param);
        setLoading(false);
        setCount(isRentFlow ? lease : sale);
      } catch (e) {
        setLoading(false);
        AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details) });
      }
    };

    const nullifyCurrentOffer = (): void => {
      dispatch(OfferActions.setCurrentOffer(null));
    };

    getOfferCount().then();

    // To set currentOffer to null to handle case where user can go to AssetDescription screen (Offer->Profile->Search)
    return (): void => nullifyCurrentOffer();
  }, []);
  // HOOKS END

  // HANDLERS START
  const handleTermsCondition = (): void => {
    navigate(ScreensKeys.WebViewScreen, { url: 'https://www.homzhub.com/privacyPolicy' });
  };

  const onSuccess = (): void => {
    if (asset) {
      const trackData = AnalyticsHelper.getPropertyTrackData(asset);
      AnalyticsService.track(EventType.NewOffer, trackData);
    }
    setIsSuccess(true);
  };

  const onCloseBottomSheet = (): void => {
    setIsSuccess(false);
    navigate(ScreensKeys.Search, {
      screen: ScreensKeys.PropertyAssetDescription,
      initial: false,
      params: {
        propertyTermId: asset?.leaseTerm?.id ?? asset?.saleTerm?.id,
      },
    });
  };
  const showRightItems = isRentFlow && !isCounterFlow;
  // HANDLERS END

  return (
    <Screen
      scrollEnabled={false}
      backgroundColor={theme.colors.white}
      isLoading={loading}
      headerProps={{
        type: 'secondary',
        // Todo (Praharsh) : Get confirmation about the header text and Edit Profile button, in Counter Offer flow.
        title: t('offers:submitOffer'),
        onIconPress: goBack,
        testID: 'submitOfferForm',
        ...(showRightItems && {
          textRight: t('moreProfile:editProfile'),
          onIconRightPress: (): void => navigate(ScreensKeys.ProspectProfile, { editData: true }),
        }),
      }}
      contentContainerStyle={styles.screen}
    >
      {/* Todo : handle ts error  */}
      {/* @ts-ignore */}
      {isFocused && <OfferForm onPressTerms={handleTermsCondition} onSuccess={onSuccess} offersLeft={count} />}
      {isSuccess && (
        <BottomSheet visible={isSuccess} onCloseSheet={onCloseBottomSheet} sheetHeight={400}>
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
            <Button
              title={t('common:done')}
              type="primary"
              containerStyle={styles.doneButton}
              onPress={onCloseBottomSheet}
            />
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