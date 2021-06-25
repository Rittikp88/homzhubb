import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { OfferUtils } from '@homzhub/common/src/utils/OfferUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import { OffersCard } from '@homzhub/web/src/screens/offers/components/OffersCard';
import { Offer } from '@homzhub/common/src/domain/models/Offer';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { OfferSort } from '@homzhub/common/src/constants/Offers';
import {
  ICounterParam,
  INegotiationParam,
  ListingType,
  NegotiationType,
} from '@homzhub/common/src/domain/repositories/interfaces';

interface IFilters {
  filter_by: string;
  sort_by: string;
}
interface IProps {
  selectedFilters?: IFilters;
}
const OfferView: FC<IProps> = (props: IProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.offers);
  const negotiations = useSelector(OfferSelectors.getNegotiations);
  const listingDetail = useSelector(OfferSelectors.getListingDetail);
  const offerPayload = useSelector(OfferSelectors.getOfferPayload);
  const compareData = useSelector(OfferSelectors.getOfferCompareData);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [pastOffers, setPastOffers] = useState<Offer[]>([]);
  const { selectedFilters = { filter_by: '', sort_by: OfferSort.NEWEST } } = props;
  useEffect(() => {
    getData(selectedFilters?.filter_by);
  }, [selectedFilters]);

  useEffect(() => {
    setOffers(OfferUtils.getSortedOffer(selectedFilters.sort_by, negotiations));
  }, [negotiations]);

  const getData = (filter_by?: string): void => {
    if (offerPayload) {
      const payload: INegotiationParam = {
        listingType: offerPayload.type,
        listingId: offerPayload.listingId,
        negotiationType:
          offerPayload.type === ListingType.LEASE_LISTING
            ? NegotiationType.LEASE_NEGOTIATIONS
            : NegotiationType.SALE_NEGOTIATIONS,
      };

      dispatch(OfferActions.getNegotiations({ param: payload, filter_by }));
    }
  };

  const handlePastOffer = async (payload: ICounterParam): Promise<void> => {
    try {
      const response = await OffersRepository.getCounterOffer(payload);
      setPastOffers(response);
    } catch (e) {
      AlertHelper.error({ message: ErrorUtils.getErrorMessage(e.details), statusCode: e.details.statusCode });
    }
  };

  return (
    <View>
      {offers.length > 0 && listingDetail ? (
        offers.map((offer, index) => {
          const { saleTerm, leaseTerm } = listingDetail;
          const onPressMessageIcon = (): void => {
            dispatch(
              OfferActions.setCurrentOfferPayload({
                type: leaseTerm ? ListingType.LEASE_LISTING : ListingType.SALE_LISTING,
                listingId: leaseTerm ? leaseTerm.id : saleTerm?.id ?? 0,
                threadId: offer.threadId,
              })
            );
          };
          if (!isMobile) {
            return (
              <OffersCard
                key={index}
                pastOffer={pastOffers}
                offer={offer}
                compareData={compareData}
                asset={listingDetail}
                isDetailView
                onMoreInfo={handlePastOffer}
                onPressMessages={onPressMessageIcon}
              />
            );
          }
          return (
            <OfferCard
              key={index}
              pastOffer={pastOffers}
              offer={offer}
              compareData={compareData}
              asset={listingDetail}
              isDetailView
              onMoreInfo={handlePastOffer}
              onPressMessages={onPressMessageIcon}
            />
          );
        })
      ) : (
        <EmptyState title={t('noOfferFound')} />
      )}
    </View>
  );
};
export default OfferView;
