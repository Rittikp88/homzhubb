import { OfferActionPayloadTypes, OfferActionTypes } from '@homzhub/common/src/modules/offers/actions';
import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IOffer, Offer } from '@homzhub/common/src/domain/models/Offer';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ICurrentOffer, IOfferCompare, IOfferState } from '@homzhub/common/src/modules/offers/interfaces';

export const initialOfferState: IOfferState = {
  currentOfferPayload: null,
  currentOffer: null,
  negotiations: [],
  listingDetail: null,
  compareData: {},
  loaders: {
    negotiations: false,
    listingDetail: false,
  },
};

export const offerReducer = (
  state: IOfferState = initialOfferState,
  action: IFluxStandardAction<OfferActionPayloadTypes>
): IOfferState => {
  switch (action.type) {
    case OfferActionTypes.GET.LISTING_DETAIL:
      return {
        ...state,
        ['listingDetail']: null,
        ['loaders']: { ...state.loaders, ['listingDetail']: true },
      };
    case OfferActionTypes.GET.LISTING_DETAIL_SUCCESS:
      return {
        ...state,
        ['listingDetail']: action.payload as IAsset,
        ['loaders']: { ...state.loaders, ['listingDetail']: false },
      };
    case OfferActionTypes.GET.LISTING_DETAIL_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['listingDetail']: false },
      };
    case OfferActionTypes.GET.NEGOTIATIONS:
      return {
        ...state,
        ['negotiations']: [],
        ['loaders']: { ...state.loaders, ['negotiations']: true },
      };
    case OfferActionTypes.GET.NEGOTIATIONS_SUCCESS:
      return {
        ...state,
        ['negotiations']: action.payload as IOffer[],
        ['loaders']: { ...state.loaders, ['negotiations']: false },
      };
    case OfferActionTypes.GET.NEGOTIATIONS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['negotiations']: false },
      };
    case OfferActionTypes.SET.CURRENT_OFFER_PAYLOAD:
      return {
        ...state,
        ['currentOfferPayload']: action.payload as ICurrentOffer,
      };
    case OfferActionTypes.SET.CURRENT_OFFER:
      return {
        ...state,
        ['currentOffer']: action.payload as Offer,
      };
    case OfferActionTypes.SET.COMPARE_OFFER_DATA:
      return {
        ...state,
        ['compareData']: action.payload as IOfferCompare,
      };
    case OfferActionTypes.CLEAR_CURRENT_OFFER:
      return {
        ...state,
        ['currentOffer']: null,
      };
    case OfferActionTypes.CLEAR_STATE:
      return initialOfferState;
    default:
      return {
        ...state,
      };
  }
};
