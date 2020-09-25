import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { Asset, IAsset } from '@homzhub/common/src/domain/models/Asset';
import { AssetGroup, IAssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';
import { AssetPlan, IAssetPlan, ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';

const actionTypePrefix = 'RecordAsset/';

export const RecordAssetActionTypes = {
  GET: {
    ASSET_GROUPS: `${actionTypePrefix}ASSET_GROUPS`,
    ASSET_GROUPS_SUCCESS: `${actionTypePrefix}ASSET_GROUPS_SUCCESS`,
    ASSET_GROUPS_FAILURE: `${actionTypePrefix}ASSET_GROUPS_FAILURE`,
    ASSET_PLAN_LIST: `${actionTypePrefix}ASSET_PLAN_LIST`,
    ASSET_PLAN_LIST_SUCCESS: `${actionTypePrefix}ASSET_PLAN_LIST_SUCCESS`,
    ASSET_PLAN_LIST_FAILURE: `${actionTypePrefix}ASSET_PLAN_LIST_FAILURE`,
    ASSET_BY_ID: `${actionTypePrefix}ASSET_BY_ID`,
    ASSET_BY_ID_SUCCESS: `${actionTypePrefix}ASSET_BY_ID_SUCCESS`,
    ASSET_BY_ID_FAILURE: `${actionTypePrefix}ASSET_BY_ID_FAILURE`,
  },
  SET: {
    ASSET_ID: `${actionTypePrefix}ASSET_ID`,
    TERM_ID: `${actionTypePrefix}TERM_ID`,
    SELECTED_PLAN: `${actionTypePrefix}SELECTED_PLAN`,
  },
  RESET: `${actionTypePrefix}RESET`,
};

const setSelectedPlan = (payload: ISelectedAssetPlan): IFluxStandardAction<ISelectedAssetPlan> => ({
  type: RecordAssetActionTypes.SET.SELECTED_PLAN,
  payload,
});

const setAssetId = (payload: number): IFluxStandardAction<number> => ({
  type: RecordAssetActionTypes.SET.ASSET_ID,
  payload,
});

const setTermId = (payload: number): IFluxStandardAction<number> => ({
  type: RecordAssetActionTypes.SET.TERM_ID,
  payload,
});

const getAssetGroups = (): IFluxStandardAction => ({
  type: RecordAssetActionTypes.GET.ASSET_GROUPS,
});

const getAssetGroupsSuccess = (payload: AssetGroup[]): IFluxStandardAction<IAssetGroup[]> => ({
  type: RecordAssetActionTypes.GET.ASSET_GROUPS_SUCCESS,
  payload: ObjectMapper.serializeArray(payload),
});

const getAssetGroupsFailure = (error: string): IFluxStandardAction => ({
  type: RecordAssetActionTypes.GET.ASSET_GROUPS_FAILURE,
  error,
});

const getAssetPlanList = (): IFluxStandardAction => {
  return {
    type: RecordAssetActionTypes.GET.ASSET_PLAN_LIST,
  };
};

const getAssetPlanListSuccess = (data: AssetPlan[]): IFluxStandardAction<IAssetPlan[]> => {
  return {
    type: RecordAssetActionTypes.GET.ASSET_PLAN_LIST_SUCCESS,
    payload: ObjectMapper.serializeArray(data),
  };
};

const getAssetPlanListFailure = (error: string): IFluxStandardAction<string> => {
  return {
    type: RecordAssetActionTypes.GET.ASSET_PLAN_LIST_FAILURE,
    error,
  };
};

const getAssetById = (assetId: number): IFluxStandardAction<number> => ({
  type: RecordAssetActionTypes.GET.ASSET_BY_ID,
  payload: assetId,
});

const getAssetByIdSuccess = (payload: Asset): IFluxStandardAction<IAsset> => ({
  type: RecordAssetActionTypes.GET.ASSET_BY_ID_SUCCESS,
  payload: ObjectMapper.serialize(payload),
});

const getAssetByIdFailure = (error: string): IFluxStandardAction => ({
  type: RecordAssetActionTypes.GET.ASSET_BY_ID_FAILURE,
  error,
});

const resetState = (): IFluxStandardAction => ({
  type: RecordAssetActionTypes.RESET,
});

export type RecordAssetPayloadTypes =
  | string
  | number
  | IAssetPlan[]
  | IAssetGroup[]
  | ISelectedAssetPlan
  | IAsset
  | undefined;

export const RecordAssetActions = {
  setSelectedPlan,
  setAssetId,
  setTermId,
  getAssetGroups,
  getAssetGroupsSuccess,
  getAssetGroupsFailure,
  getAssetPlanList,
  getAssetPlanListSuccess,
  getAssetPlanListFailure,
  getAssetById,
  getAssetByIdSuccess,
  getAssetByIdFailure,
  resetState,
};
