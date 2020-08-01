import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IAssetState } from '@homzhub/common/src/modules/asset/interfaces';
import { AssetActionTypes, AssetPayloadTypes } from '@homzhub/common/src/modules/asset/actions';
import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IAssetReview } from '@homzhub/common/src/domain/models/AssetReview';

const initialAssetState: IAssetState = {
  error: {
    reviews: '',
    asset: '',
  },
  loaders: {
    reviews: false,
    asset: false,
  },
  asset: null,
  reviews: [],
};

export const assetReducer = (
  state: IAssetState = initialAssetState,
  action: IFluxStandardAction<AssetPayloadTypes>
): IAssetState => {
  switch (action.type) {
    case AssetActionTypes.GET.REVIEWS:
      return {
        ...state,
        ['reviews']: [],
        ['loaders']: { ...state.loaders, ['reviews']: true },
        ['error']: { ...state.error, ['reviews']: '' },
      };
    case AssetActionTypes.GET.REVIEWS_SUCCESS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['reviews']: false },
        ['reviews']: action.payload as IAssetReview[],
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
    case AssetActionTypes.POST.LEAD_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['asset']: false },
        ['error']: { ...state.error, ['asset']: action.error as string },
      };
    case AssetActionTypes.POST.LEAD:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['asset']: true },
        ['error']: { ...state.error, ['asset']: '' },
      };
    case AssetActionTypes.POST.LEAD_SUCCESS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['asset']: false },
        ['error']: { ...state.error, ['asset']: '' },
      };
    case AssetActionTypes.CLEAR_ASSET:
      return initialAssetState;
    default:
      return state;
  }
};
