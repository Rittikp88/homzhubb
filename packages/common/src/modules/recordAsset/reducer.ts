import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IRecordAssetState } from '@homzhub/common/src/modules/recordAsset/interface';
import { RecordAssetActionTypes, RecordAssetPayloadTypes } from '@homzhub/common/src/modules/recordAsset/actions';
import { IAssetPlan, ISelectedAssetPlan, TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';

export const initialRecordAssetState: IRecordAssetState = {
  assetPlan: [],
  selectedAssetPlan: {
    id: 0,
    selectedPlan: TypeOfPlan.RENT,
  },
  error: {
    assetPlan: '',
  },
  loaders: {
    assetPlan: false,
  },
};

export const recordAssetReducer = (
  state: IRecordAssetState = initialRecordAssetState,
  action: IFluxStandardAction<RecordAssetPayloadTypes>
): IRecordAssetState => {
  switch (action.type) {
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
    case RecordAssetActionTypes.SET.SELECTED_PLAN:
      return { ...state, ['selectedAssetPlan']: action.payload as ISelectedAssetPlan };
    default:
      return state;
  }
};
