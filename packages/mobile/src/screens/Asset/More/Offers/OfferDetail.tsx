import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { FunctionUtils } from '@homzhub/common/src/utils/FunctionUtils';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { theme } from '@homzhub/common/src/styles/theme';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import PropertyOffers from '@homzhub/common/src/components/molecules/PropertyOffers';
import OfferView from '@homzhub/common/src/components/organisms/OfferView';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { OfferAction } from '@homzhub/common/src/domain/models/Offer';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { propertyOffer } from '@homzhub/common/src/mocks/PropertyOffer';

const OfferDetail = (): React.ReactElement => {
  const { navigate, goBack } = useNavigation();
  const { t } = useTranslation();

  const data = ObjectMapper.deserializeArray(Asset, propertyOffer);

  const handleActions = (action: OfferAction): void => {
    switch (action) {
      case OfferAction.ACCEPT:
        navigate(ScreensKeys.AcceptOffer);
        break;
      case OfferAction.REJECT:
        navigate(ScreensKeys.RejectOffer);
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
      onBackPress={goBack}
      headerStyle={styles.headerStyle}
    >
      <PropertyOffers propertyOffer={data[0]} isCardExpanded isDetailView />
      <OfferView onPressAction={handleActions} isDetailView filterStyle={styles.filter} />
    </UserScreen>
  );
};

export default OfferDetail;

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: theme.colors.white,
  },
  filter: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 0,
  },
});
