import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { theme } from '@homzhub/common/src/styles/theme';
import { UserScreen } from '@homzhub/mobile/src/components/HOC/UserScreen';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import { Offer } from '@homzhub/common/src/domain/models/Offer';
import { ScreensKeys } from '@homzhub/mobile/src/navigation/interfaces';
import { offers } from '@homzhub/common/src/mocks/Offers';

const OfferDetail = (): React.ReactElement => {
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  // TODO: Remove after API integration
  const data = ObjectMapper.deserializeArray(Offer, offers);

  const navigateToAccept = (): void => {
    navigate(ScreensKeys.AcceptOffer);
  };

  return (
    <UserScreen title={t('offers')} backgroundColor={theme.colors.background}>
      {data.map((item, index) => {
        return <OfferCard key={index} offer={item} onPressAccept={navigateToAccept} />;
      })}
    </UserScreen>
  );
};

export default OfferDetail;
