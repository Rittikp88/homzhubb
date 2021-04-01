import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { theme } from '@homzhub/common/src/styles/theme';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import PropertyOffers from '@homzhub/common/src/components/molecules/PropertyOffers';
import OfferView from '@homzhub/common/src/components/organisms/OfferView';
import { OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';

const OfferDetail = (): React.ReactElement => {
  const { navigate, goBack } = useNavigation();
  const { t } = useTranslation();
  const offerPayload = useSelector(OfferSelectors.getOfferPayload);
  const listingDetail = useSelector(OfferSelectors.getListingDetail);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      if (offerPayload) {
        dispatch(OfferActions.getListingDetail(offerPayload));
      }
    }, [])
  );

  const handleBack = (): void => {
    dispatch(OfferActions.clearState());
    goBack();
  };

  const handleActions = (action: OfferAction): void => {
    switch (action) {
      case OfferAction.ACCEPT:
        navigate(ScreensKeys.AcceptOffer);
        break;
      case OfferAction.REJECT:
        navigate(ScreensKeys.RejectOffer);
        break;
      case OfferAction.COUNTER:
        navigate(ScreensKeys.SubmitOffer);
        break;
      default:
        FunctionUtils.noop();
    }
  };

  return (
    <UserScreen
      title={t('offers')}
      backgroundColor={theme.colors.background}
      pageTitle={t('offers:offerDetails')}
      onBackPress={handleBack}
      headerStyle={styles.headerStyle}
      loading={!listingDetail}
    >
      {listingDetail && <PropertyOffers propertyOffer={listingDetail} isCardExpanded isDetailView />}
      <OfferView onPressAction={handleActions} isDetailView />
    </UserScreen>
  );
};

export default OfferDetail;

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: theme.colors.white,
  },
});
