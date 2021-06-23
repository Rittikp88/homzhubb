import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useDown } from '@homzhub/common/src/utils/MediaQueryUtils';
import { OfferUtils } from '@homzhub/common/src/utils/OfferUtils';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import { OffersCard } from '@homzhub/web/src/screens/offers/components/OffersCard';
import { Offer } from '@homzhub/common/src/domain/models/Offer';
import { deviceBreakpoint } from '@homzhub/common/src/constants/DeviceBreakpoints';
import { LocaleConstants } from '@homzhub/common/src/services/Localization/constants';
import { OfferSort } from '@homzhub/common/src/constants/Offers';
import { INegotiationParam, ListingType, NegotiationType } from '@homzhub/common/src/domain/repositories/interfaces';

interface IFilters {
  filter_by: string;
  sort_by: string;
}
const OfferView: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(LocaleConstants.namespacesKey.offers);
  const negotiations = useSelector(OfferSelectors.getNegotiations);
  const listingDetail = useSelector(OfferSelectors.getListingDetail);
  const offerPayload = useSelector(OfferSelectors.getOfferPayload);
  const compareData = useSelector(OfferSelectors.getOfferCompareData);
  const isMobile = useDown(deviceBreakpoint.MOBILE);
  const [offers, setOffers] = useState<Offer[]>([]);
  const filters: IFilters = { filter_by: '', sort_by: OfferSort.NEWEST };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setOffers(OfferUtils.getSortedOffer(filters.sort_by, negotiations));
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
                offer={offer}
                compareData={compareData}
                asset={listingDetail}
                isDetailView
                onPressMessages={onPressMessageIcon}
              />
            );
          }
          return (
            <OfferCard
              key={index}
              offer={offer}
              compareData={compareData}
              asset={listingDetail}
              isDetailView
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
