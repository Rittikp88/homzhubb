import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { AssetPlan, IAssetPlan, ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';

const actionTypePrefix = 'RecordAsset/';

export const RecordAssetActionTypes = {
  GET: {
    ASSET_PLAN_LIST: `${actionTypePrefix}ASSET_PLAN_LIST`,
    ASSET_PLAN_LIST_SUCCESS: `${actionTypePrefix}ASSET_PLAN_LIST_SUCCESS`,
    ASSET_PLAN_LIST_FAILURE: `${actionTypePrefix}ASSET_PLAN_LIST_FAILURE`,
  },
  SET: {
    SELECTED_PLAN: `${actionTypePrefix}SELECTED_PLAN`,
  },
};

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

const setSelectedPlan = (payload: ISelectedAssetPlan): IFluxStandardAction<ISelectedAssetPlan> => ({
  type: RecordAssetActionTypes.SET.SELECTED_PLAN,
  payload,
});

export type RecordAssetPayloadTypes = string | number | IAssetPlan[] | ISelectedAssetPlan | undefined;

export const RecordAssetActions = {
  getAssetPlanList,
  getAssetPlanListSuccess,
  getAssetPlanListFailure,
  setSelectedPlan,
};
