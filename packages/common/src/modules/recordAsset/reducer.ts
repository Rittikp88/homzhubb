import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IRecordAssetState } from '@homzhub/common/src/modules/recordAsset/interface';
import { RecordAssetActionTypes, RecordAssetPayloadTypes } from '@homzhub/common/src/modules/recordAsset/actions';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IAssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';
import { IAssetPlan, ISelectedAssetPlan, TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';

export const initialRecordAssetState: IRecordAssetState = {
  assetId: -1,
  assetPlan: [],
  assetGroups: [],
  assetDetails: null,
  selectedAssetPlan: {
    id: 0,
    selectedPlan: TypeOfPlan.RENT,
  },
  error: {
    assetPlan: '',
  },
  loaders: {
    assetPlan: false,
    assetGroups: false,
    assetDetails: false,
  },
};

export const recordAssetReducer = (
  state: IRecordAssetState = initialRecordAssetState,
  action: IFluxStandardAction<RecordAssetPayloadTypes>
): IRecordAssetState => {
  switch (action.type) {
    case RecordAssetActionTypes.GET.ASSET_GROUPS:
      return {
        ...state,
        ['assetGroups']: [],
        ['loaders']: { ...state.loaders, ['assetGroups']: true },
      };
    case RecordAssetActionTypes.GET.ASSET_GROUPS_SUCCESS:
      return {
        ...state,
        ['assetGroups']: action.payload as IAssetGroup[],
        ['loaders']: { ...state.loaders, ['assetGroups']: false },
      };
    case RecordAssetActionTypes.GET.ASSET_GROUPS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['assetGroups']: false },
      };
    case RecordAssetActionTypes.GET.ASSET_PLAN_LIST:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['assetPlan']: true },
        ['error']: { ...state.error, ['assetPlan']: '' },
      };
    case RecordAssetActionTypes.GET.ASSET_PLAN_LIST_SUCCESS:
      return {
        ...state,
        ['assetPlan']: action.payload as IAssetPlan[],
        ['loaders']: { ...state.loaders, ['assetPlan']: false },
      };
    case RecordAssetActionTypes.GET.ASSET_PLAN_LIST_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['assetPlan']: false },
        ['error']: { ...state.error, ['assetPlan']: action.error as string },
      };
    case RecordAssetActionTypes.GET.ASSET_BY_ID_SUCCESS:
      return {
        ...state,
        ['assetDetails']: action.payload as Asset,
        ['loaders']: { ...state.loaders, ['assetDetails']: false },
      };
    case RecordAssetActionTypes.GET.ASSET_BY_ID_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['assetDetails']: false },
      };
    case RecordAssetActionTypes.SET.ASSET_ID:
      return { ...state, ['assetId']: action.payload as number };
    case RecordAssetActionTypes.SET.SELECTED_PLAN:
      return { ...state, ['selectedAssetPlan']: action.payload as ISelectedAssetPlan };
    case RecordAssetActionTypes.RESET:
      return initialRecordAssetState;
    default:
      return state;
  }
};
