import React, { FC, useEffect, useState, createRef } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PopupActions } from 'reactjs-popup/dist/types';
import { useOnly } from '@homzhub/common/src/utils/MediaQueryUtils';
import { AlertHelper } from '@homzhub/common/src/utils/AlertHelper';
import { ErrorUtils } from '@homzhub/common/src/utils/ErrorUtils';
import { OfferUtils } from '@homzhub/common/src/utils/OfferUtils';
import { OffersRepository } from '@homzhub/common/src/domain/repositories/OffersRepository';
import { OfferActions } from '@homzhub/common/src/modules/offers/actions';
import { OfferSelectors } from '@homzhub/common/src/modules/offers/selectors';
import { EmptyState } from '@homzhub/common/src/components/atoms/EmptyState';
import OfferCard from '@homzhub/common/src/components/organisms/OfferCard';
import { OffersCard } from '@homzhub/web/src/screens/offers/components/OffersCard';
import OfferActionsPopover from '@homzhub/web/src/screens/offers/components/OfferActionsPopover';
import { Offer, OfferAction } from '@homzhub/common/src/domain/models/Offer';
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
  const [currentOffer, setCurrentOffer] = useState<Offer>(new Offer());
  const compareData = useSelector(OfferSelectors.getOfferCompareData);
  const isMobile = useOnly(deviceBreakpoint.MOBILE);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offerActionType, setOfferActionType] = useState<OfferAction | null>(null);
  const popupRef = createRef<PopupActions>();
  const [pastOffers, setPastOffers] = useState<Offer[]>([]);
  const { selectedFilters = { filter_by: '', sort_by: OfferSort.NEWEST } } = props;
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

  useEffect(() => {
    getData(selectedFilters?.filter_by);
  }, [selectedFilters]);

  useEffect(() => {
    setOffers(OfferUtils.getSortedOffer(selectedFilters.sort_by, negotiations));
  }, [negotiations]);

  if (!(offers.length > 0 && listingDetail)) {
    return <EmptyState title={t('noOfferFound')} />;
  }

  const { saleTerm, leaseTerm } = listingDetail;

  const onViewReasonWeb = (action: OfferAction, offer: Offer): void => {
    setCurrentOffer(offer);
    setOfferActionType(action);
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };

  const onPressAction = (action: OfferAction, offer: Offer): void => {
    dispatch(OfferActions.setCurrentOffer(offer));
    setOfferActionType(action);
    if (popupRef && popupRef.current) {
      popupRef.current.open();
    }
  };

  const onPressMessageIcon = (threadId: string): void => {
    dispatch(
      OfferActions.setCurrentOfferPayload({
        type: leaseTerm ? ListingType.LEASE_LISTING : ListingType.SALE_LISTING,
        listingId: leaseTerm ? leaseTerm.id : saleTerm?.id ?? 0,
        threadId,
      })
    );
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
      {!isMobile &&
        offers.length &&
        Object.values(listingDetail).length &&
        offers.map((offer, index) => (
          <OffersCard
            key={index}
            offer={offer}
            compareData={compareData}
            asset={listingDetail}
            isDetailView
            onPressMessages={(): void => onPressMessageIcon(offer.threadId)}
            onPressAction={(action: OfferAction): void => onPressAction(action, offer)}
            onViewReasonWeb={(action: OfferAction): void => onViewReasonWeb(action, offer)}
            pastOffer={pastOffers}
            onMoreInfo={handlePastOffer}
          />
        ))}
      {isMobile &&
        offers.map((offer, index) => (
          <OfferCard
            key={index}
            offer={offer}
            compareData={compareData}
            asset={listingDetail}
            isDetailView
            onPressMessages={(): void => onPressMessageIcon(offer.threadId)}
            onPressAction={(action: OfferAction): void => onPressAction(action, offer)}
            onViewReasonWeb={(action: OfferAction): void => onViewReasonWeb(action, offer)}
            pastOffer={pastOffers}
            onMoreInfo={handlePastOffer}
          />
        ))}
      <OfferActionsPopover offerActionType={offerActionType} popupRef={popupRef} offer={currentOffer} />
    </View>
  );
};
export default OfferView;
