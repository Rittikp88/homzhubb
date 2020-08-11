import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IGetAssetPayload } from '@homzhub/common/src/modules/asset/interfaces';
import { ILeadPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { Asset, IAsset } from '@homzhub/common/src/domain/models/Asset';
import { AssetReview, IAssetReview } from '@homzhub/common/src/domain/models/AssetReview';

const actionTypePrefix = 'Asset/';

export const AssetActionTypes = {
  GET: {
    ASSET: `${actionTypePrefix}ASSET`,
    ASSET_SUCCESS: `${actionTypePrefix}ASSET_SUCCESS`,
    ASSET_FAILURE: `${actionTypePrefix}ASSET_FAILURE`,
    REVIEWS: `${actionTypePrefix}REVIEW`,
    REVIEWS_SUCCESS: `${actionTypePrefix}REVIEW_SUCCESS`,
    REVIEWS_FAILURE: `${actionTypePrefix}REVIEW_FAILURE`,
  },
  POST: {
    LEAD: `${actionTypePrefix}LEAD`,
    LEAD_SUCCESS: `${actionTypePrefix}LEAD_SUCCESS`,
    LEAD_FAILURE: `${actionTypePrefix}LEAD_FAILURE`,
  },
  CLEAR_ASSET: `${actionTypePrefix}CLEAR_ASSET`,
};

const getAssetReviews = (id: number): IFluxStandardAction<number> => ({
  type: AssetActionTypes.GET.REVIEWS,
  payload: id,
});

const getAssetReviewsSuccess = (payload: AssetReview[]): IFluxStandardAction<IAssetReview[]> => ({
  type: AssetActionTypes.GET.REVIEWS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getAssetReviewsFailure = (error: string): IFluxStandardAction => ({
  type: AssetActionTypes.GET.REVIEWS_FAILURE,
  error,
});

const getAsset = (payload: IGetAssetPayload): IFluxStandardAction<IGetAssetPayload> => ({
  type: AssetActionTypes.GET.ASSET,
  payload,
});

const getAssetSuccess = (asset: Asset): IFluxStandardAction<IAsset> => ({
  type: AssetActionTypes.GET.ASSET_SUCCESS,
  payload: ObjectMapper.serialize(asset),
});

const getAssetFailure = (error: string): IFluxStandardAction => ({
  type: AssetActionTypes.GET.ASSET_FAILURE,
  error,
});

const clearAsset = (): IFluxStandardAction => ({
  type: AssetActionTypes.CLEAR_ASSET,
});

const postLead = (payload: ILeadPayload): IFluxStandardAction<ILeadPayload> => ({
  type: AssetActionTypes.POST.LEAD,
  payload,
});

const postLeadSuccess = (): IFluxStandardAction => ({
  type: AssetActionTypes.POST.LEAD_SUCCESS,
});

const postLeadFailure = (error: string): IFluxStandardAction<string> => ({
  type: AssetActionTypes.POST.LEAD_FAILURE,
  error,
});

export type AssetPayloadTypes = number | IAssetReview[] | IAsset;

export const AssetActions = {
  clearAsset,
  getAssetReviews,
  getAssetReviewsSuccess,
  getAssetReviewsFailure,
  getAsset,
  getAssetSuccess,
  getAssetFailure,
  postLead,
  postLeadSuccess,
  postLeadFailure,
};
