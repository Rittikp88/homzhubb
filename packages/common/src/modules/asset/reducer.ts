import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IAssetState } from '@homzhub/common/src/modules/asset/interfaces';
import { AssetActionTypes, AssetPayloadTypes } from '@homzhub/common/src/modules/asset/actions';
import { IAssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { mockReviews } from '../../mocks/AssetDescription';

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
  reviews: mockReviews,
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
    case AssetActionTypes.CLEAR_ASSET:
      return initialAssetState;
    default:
      return state;
  }
};
