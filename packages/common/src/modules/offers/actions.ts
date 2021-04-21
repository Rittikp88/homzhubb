import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset, IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IOffer, Offer } from '@homzhub/common/src/domain/models/Offer';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { INegotiation } from '@homzhub/common/src/domain/repositories/interfaces';
import { ICurrentOffer, IOfferCompare, IOfferFormValues } from '@homzhub/common/src/modules/offers/interfaces';

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
    CURRENT_OFFER: `${actionTypePrefix}CURRENT_OFFER`,
    COMPARE_OFFER_DATA: `${actionTypePrefix}COMPARE_OFFER_DATA`,
    OFFER_FORM_VALUES: `${actionTypePrefix}OFFER_FORM_VALUES`,
  },
  CLEAR_CURRENT_OFFER: `${actionTypePrefix}CLEAR_CURRENT_OFFER`,
  CLEAR_STATE: `${actionTypePrefix}CLEAR_STATE`,
  CLEAR_OFFER_FORM_VALUES: `${actionTypePrefix}CLEAR_OFFER_FORM_VALUES`,
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

const getNegotiations = (payload: INegotiation): IFluxStandardAction<INegotiation> => ({
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

const setCurrentOfferPayload = (payload: ICurrentOffer): IFluxStandardAction<ICurrentOffer> => ({
  type: OfferActionTypes.SET.CURRENT_OFFER_PAYLOAD,
  payload,
});

const setCompareDetail = (payload: IOfferCompare): IFluxStandardAction<IOfferCompare> => ({
  type: OfferActionTypes.SET.COMPARE_OFFER_DATA,
  payload,
});

const setCurrentOffer = (payload: Offer): IFluxStandardAction<Offer> => ({
  type: OfferActionTypes.SET.CURRENT_OFFER,
  payload,
});

const clearCurrentOffer = (): IFluxStandardAction => ({
  type: OfferActionTypes.CLEAR_CURRENT_OFFER,
});

const setOfferFormValues = (payload: IOfferFormValues): IFluxStandardAction<IOfferFormValues> => ({
  type: OfferActionTypes.SET.OFFER_FORM_VALUES,
  payload,
});

const clearOfferFormValues = (): IFluxStandardAction => ({
  type: OfferActionTypes.CLEAR_OFFER_FORM_VALUES,
});

export type OfferActionPayloadTypes =
  | ICurrentOffer
  | IAsset
  | INegotiation
  | IOffer[]
  | IOfferCompare
  | Offer
  | IOfferFormValues;

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
  setCurrentOfferPayload,
  clearCurrentOffer,
  setOfferFormValues,
  clearOfferFormValues,
};
