import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IGetAssetPayload, IGetDocumentPayload } from '@homzhub/common/src/modules/asset/interfaces';
import { Asset, IAsset } from '@homzhub/common/src/domain/models/Asset';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { AssetReview, IAssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { AssetVisit, IAssetVisit } from '@homzhub/common/src/domain/models/AssetVisit';
import { IAssetVisitPayload } from '@homzhub/common/src/domain/repositories/interfaces';

const actionTypePrefix = 'Asset/';

export const AssetActionTypes = {
  GET: {
    ASSET: `${actionTypePrefix}ASSET`,
    ASSET_SUCCESS: `${actionTypePrefix}ASSET_SUCCESS`,
    ASSET_FAILURE: `${actionTypePrefix}ASSET_FAILURE`,
    REVIEWS: `${actionTypePrefix}REVIEW`,
    REVIEWS_SUCCESS: `${actionTypePrefix}REVIEW_SUCCESS`,
    REVIEWS_FAILURE: `${actionTypePrefix}REVIEW_FAILURE`,
    ASSET_DOCUMENT: `${actionTypePrefix}ASSET_DOCUMENT`,
    ASSET_DOCUMENT_SUCCESS: `${actionTypePrefix}ASSET_DOCUMENT_SUCCESS`,
    ASSET_DOCUMENT_FAILURE: `${actionTypePrefix}ASSET_DOCUMENT_FAILURE`,
    ASSET_VISIT: `${actionTypePrefix}ASSET_VISIT`,
    ASSET_VISIT_SUCCESS: `${actionTypePrefix}ASSET_VISIT_SUCCESS`,
    ASSET_VISIT_FAILURE: `${actionTypePrefix}ASSET_VISIT_FAILURE`,
  },
  SET: {
    VISIT_IDS: `${actionTypePrefix}VISIT_IDS`,
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

const getAssetDocument = (payload: IGetDocumentPayload): IFluxStandardAction<IGetDocumentPayload> => ({
  type: AssetActionTypes.GET.ASSET_DOCUMENT,
  payload,
});

const getAssetDocumentSuccess = (data: AssetDocument[]): IFluxStandardAction<AssetDocument[]> => ({
  type: AssetActionTypes.GET.ASSET_DOCUMENT_SUCCESS,
  payload: data,
});

const getAssetDocumentFailure = (error: string): IFluxStandardAction<string> => ({
  type: AssetActionTypes.GET.ASSET_DOCUMENT_FAILURE,
  error,
});

const getAssetVisit = (payload: IAssetVisitPayload): IFluxStandardAction<IAssetVisitPayload> => ({
  type: AssetActionTypes.GET.ASSET_VISIT,
  payload,
});

const getAssetVisitSuccess = (payload: AssetVisit[]): IFluxStandardAction<IAssetVisit[]> => ({
  type: AssetActionTypes.GET.ASSET_VISIT_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getAssetVisitFailure = (error: string): IFluxStandardAction<string> => ({
  type: AssetActionTypes.GET.ASSET_VISIT_FAILURE,
  error,
});

const setVisitIds = (payload: number[]): IFluxStandardAction<number[]> => ({
  type: AssetActionTypes.SET.VISIT_IDS,
  payload,
});

export type AssetPayloadTypes = number | IAssetReview[] | IAsset | IAssetVisit[] | number[];

export const AssetActions = {
  clearAsset,
  getAssetReviews,
  getAssetReviewsSuccess,
  getAssetReviewsFailure,
  getAsset,
  getAssetSuccess,
  getAssetFailure,
  getAssetDocument,
  getAssetDocumentSuccess,
  getAssetDocumentFailure,
  getAssetVisit,
  getAssetVisitSuccess,
  getAssetVisitFailure,
  setVisitIds,
};
