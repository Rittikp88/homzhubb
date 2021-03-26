import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset, IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IOffer, Offer } from '@homzhub/common/src/domain/models/Offer';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { INegotiationParam } from '@homzhub/common/src/domain/repositories/interfaces';
import { ICurrentOffer, IOfferCompare } from '@homzhub/common/src/modules/offers/interfaces';

const actionTypePrefix = 'Offers/';
export const OfferActionTypes = {
  GET: {
    LISTING_DETAIL: `${actionTypePrefix}LISTING_DETAIL`,
    LISTING_DETAIL_SUCCESS: `${actionTypePrefix}LISTING_DETAIL_SUCCESS`,
    LISTING_DETAIL_FAILURE: `${actionTypePrefix}LISTING_DETAIL_FAILURE`,
    NEGOTIATIONS: `${actionTypePrefix}NEGOTIATIONS`,
    NEGOTIATIONS_SUCCESS: `${actionTypePrefix}NEGOTIATIONS_SUCCESS`,
    NEGOTIATIONS_FAILURE: `${actionTypePrefix}NEGOTIATIONS_FAILURE`,
  },
  SET: {
    CURRENT_OFFER_PAYLOAD: `${actionTypePrefix}CURRENT_OFFER_PAYLOAD`,
    COMPARE_OFFER_DATA: `${actionTypePrefix}COMPARE_OFFER_DATA`,
  },
  CLEAR_STATE: `${actionTypePrefix}CLEAR_STATE`,
};

const clearState = (): IFluxStandardAction => ({
  type: OfferActionTypes.CLEAR_STATE,
});

const getListingDetail = (payload: ICurrentOffer): IFluxStandardAction<ICurrentOffer> => ({
  type: OfferActionTypes.GET.LISTING_DETAIL,
  payload,
});

const getListingDetailSuccess = (payload: Asset): IFluxStandardAction<IAsset> => ({
  type: OfferActionTypes.GET.LISTING_DETAIL_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getListingDetailFailure = (): IFluxStandardAction => ({
  type: OfferActionTypes.GET.LISTING_DETAIL_FAILURE,
});

const getNegotiations = (payload: INegotiationParam): IFluxStandardAction<INegotiationParam> => ({
  type: OfferActionTypes.GET.NEGOTIATIONS,
  payload,
});

const getNegotiationsSuccess = (payload: Offer[]): IFluxStandardAction<IOffer[]> => ({
  type: OfferActionTypes.GET.NEGOTIATIONS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getNegotiationsFailure = (): IFluxStandardAction => ({
  type: OfferActionTypes.GET.NEGOTIATIONS_FAILURE,
});

const setCurrentOffer = (payload: ICurrentOffer): IFluxStandardAction<ICurrentOffer> => ({
  type: OfferActionTypes.SET.CURRENT_OFFER_PAYLOAD,
  payload,
});

const setCompareDetail = (payload: IOfferCompare): IFluxStandardAction<IOfferCompare> => ({
  type: OfferActionTypes.SET.COMPARE_OFFER_DATA,
  payload,
});

export type OfferActionPayloadTypes = ICurrentOffer | IAsset | INegotiationParam | IOffer[] | IOfferCompare;

export const OfferActions = {
  clearState,
  setCurrentOffer,
  getListingDetail,
  getListingDetailSuccess,
  getListingDetailFailure,
  getNegotiations,
  getNegotiationsSuccess,
  getNegotiationsFailure,
  setCompareDetail,
};
