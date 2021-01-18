import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IAssetState } from '@homzhub/common/src/modules/asset/interfaces';
import { AssetActionTypes, AssetPayloadTypes } from '@homzhub/common/src/modules/asset/actions';
import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IAssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { IAssetVisit } from '@homzhub/common/src/domain/models/AssetVisit';

export const initialAssetState: IAssetState = {
  error: {
    reviews: '',
    asset: '',
    documents: '',
    visits: '',
  },
  loaders: {
    reviews: false,
    asset: false,
    documents: false,
    visits: false,
  },
  asset: null,
  reviews: null,
  documents: [],
  visits: [],
  visitIds: [],
};

export const assetReducer = (
  state: IAssetState = initialAssetState,
  action: IFluxStandardAction<AssetPayloadTypes>
): IAssetState => {
  switch (action.type) {
    case AssetActionTypes.GET.REVIEWS:
      return {
        ...state,
        ['reviews']: null,
        ['loaders']: { ...state.loaders, ['reviews']: true },
        ['error']: { ...state.error, ['reviews']: '' },
      };
    case AssetActionTypes.GET.REVIEWS_SUCCESS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reviews']: false },
        ['reviews']: action.payload as IAssetReview,
      };
    case AssetActionTypes.GET.REVIEWS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reviews']: false },
        ['error']: { ...state.error, ['reviews']: action.error as string },
      };
    case AssetActionTypes.GET.ASSET:
      return {
        ...state,
        asset: null,
        ['loaders']: { ...state.loaders, ['asset']: true },
        ['error']: { ...state.error, ['asset']: '' },
      };
    case AssetActionTypes.GET.ASSET_SUCCESS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['asset']: false },
        ['asset']: action.payload as IAsset,
      };
    case AssetActionTypes.GET.ASSET_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['asset']: false },
        ['error']: { ...state.error, ['asset']: action.error as string },
      };
    case AssetActionTypes.GET.ASSET_DOCUMENT:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['documents']: true },
        ['error']: { ...state.error, ['documents']: '' },
      };
    case AssetActionTypes.GET.ASSET_DOCUMENT_SUCCESS:
      return {
        ...state,
        ['documents']: action.payload as any,
        ['loaders']: { ...state.loaders, ['documents']: false },
        ['error']: { ...state.error, ['documents']: '' },
      };
    case AssetActionTypes.GET.ASSET_DOCUMENT_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['documents']: false },
        ['error']: { ...state.error, ['documents']: action.error as string },
      };
    case AssetActionTypes.GET.ASSET_VISIT:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['visits']: true },
        ['error']: { ...state.error, ['visits']: '' },
      };
    case AssetActionTypes.GET.ASSET_VISIT_SUCCESS:
      return {
        ...state,
        ['visits']: action.payload as IAssetVisit[],
        ['loaders']: { ...state.loaders, ['visits']: false },
        ['error']: { ...state.error, ['visits']: '' },
      };
    case AssetActionTypes.GET.ASSET_VISIT_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['visits']: false },
        ['error']: { ...state.error, ['visits']: action.error as string },
      };
    case AssetActionTypes.SET.VISIT_IDS:
      return { ...state, ['visitIds']: action.payload as number[] };
    case AssetActionTypes.CLEAR_ASSET:
      return initialAssetState;
    default:
      return state;
  }
};
