import React, { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { theme } from '@homzhub/common/src/styles/theme';
import { Typography } from '@homzhub/common/src/components/atoms/Typography';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import { OffersCard } from '@homzhub/web/src/screens/offers/components/OffersCard';
import PropertyOfferDetails from '@homzhub/web/src/screens/offers/components/PropertyOfferDetails';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Offer } from '@homzhub/common/src/domain/models/Offer';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { IOfferCompare } from '@homzhub/common/src/modules/offers/interfaces';
import { ICounterParam, ListingType } from '@homzhub/common/src/domain/repositories/interfaces';

interface IProps {
  property: Asset;
  onPressMessages: () => void;
}
const OffersMade: FC<IProps> = (props: IProps) => {
  const {
    property,
    property: { leaseNegotiation, saleNegotiation, leaseTerm, saleTerm },
    onPressMessages,
  } = props;
  const offer = leaseNegotiation || saleNegotiation;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [pastOffers, setPastOffers] = useState<Offer[]>([]);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const compareData = (): IOfferCompare => {
    if (leaseTerm) {
      return {
        rent: leaseTerm.expectedPrice,
        deposit: leaseTerm.securityDeposit,
        incrementPercentage: Number(leaseTerm.annualRentIncrementPercentage),
      };
    }
    return {
      price: saleTerm ? Number(saleTerm.expectedPrice) : 0,
      bookingAmount: saleTerm ? Number(saleTerm.expectedBookingAmount) : 0,
    };
  };
  const handlePastOffer = async (payload: ICounterParam): Promise<void> => {
    try {
      const response = await OffersRepository.getCounterOffer(payload);
      setPastOffers(response);
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };
  const onPressMessageIcon = (): void => {
    if (offer) {
      dispatch(
        OfferActions.setCurrentOfferPayload({
          type: leaseTerm ? ListingType.LEASE_LISTING : ListingType.SALE_LISTING,
          listingId: leaseTerm ? leaseTerm.id : saleTerm?.id ?? 0,
          threadId: offer.threadId,
        })
      );
    }
    onPressMessages();
  };
  // TODO: Integration with dynamic offers value - shagun
  return (
    <View>
      <View style={styles.background}>
        <PropertyOfferDetails property={property} isExpanded containerStyles={styles.innerContainer} />
      </View>
      <Typography variant="text" size="small" fontWeight="semiBold" style={styles.heading}>
        {`${t('common:offers')} (${1})`}
      </Typography>
      {!isMobile && offer && (
        <OffersCard
          offer={offer}
          compareData={compareData}
          asset={property}
          isDetailView
          onPressMessages={onPressMessageIcon}
          isOfferDashboard1
          pastOffer={pastOffers}
          onMoreInfo={handlePastOffer}
        />
      )}
      {isMobile && offer && (
        <OfferCard
          offer={offer}
          compareData={compareData()}
          asset={property}
          isDetailView
          onPressMessages={onPressMessageIcon}
          isOfferDashboard
          pastOffer={pastOffers}
          onMoreInfo={handlePastOffer}
        />
      )}
    </View>
  );
};
export default OffersMade;
const styles = StyleSheet.create({
  innerContainer: {
    top: 12,
    left: 12,
    paddingBottom: 12,
  },
  heading: {
    marginTop: 25,
    marginBottom: 20,
  },
  background: {
    backgroundColor: theme.colors.white,
  },
});
