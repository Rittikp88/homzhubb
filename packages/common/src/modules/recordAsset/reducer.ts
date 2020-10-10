import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IRecordAssetState } from '@homzhub/common/src/modules/recordAsset/interface';
import { RecordAssetActionTypes, RecordAssetPayloadTypes } from '@homzhub/common/src/modules/recordAsset/actions';
import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IAssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';
import { IAssetPlan, ISelectedAssetPlan, TypeOfPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ISelectedValueServices } from '@homzhub/common/src/domain/models/ValueAddedService';
import { IUnit } from '@homzhub/common/src/domain/models/Unit';

export const initialRecordAssetState: IRecordAssetState = {
  assetId: -1,
  termId: -1,
  assetPlan: [],
  assetGroups: [],
  maintenanceUnits: [],
  assetDetails: null,
  selectedAssetPlan: {
    id: 0,
    selectedPlan: TypeOfPlan.RENT,
  },
  selectedValueServices: [],
  error: {
    assetPlan: '',
  },
  loaders: {
    assetPlan: false,
    assetGroups: false,
    assetDetails: false,
  },
};

const getValueServicesArray = (state: IRecordAssetState, payload: ISelectedValueServices): ISelectedValueServices[] => {
  let { selectedValueServices } = state;

  if (payload.value) {
    selectedValueServices.push(payload);
  } else {
    selectedValueServices = selectedValueServices.filter((item) => {
      return item.id !== payload.id;
    });
  }

  return selectedValueServices;
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
    case RecordAssetActionTypes.GET.ASSET_BY_ID:
      return {
        ...state,
        ['assetDetails']: null,
        ['loaders']: { ...state.loaders, ['assetDetails']: true },
      };
    case RecordAssetActionTypes.GET.ASSET_BY_ID_SUCCESS:
      return {
        ...state,
        ['assetDetails']: action.payload as IAsset,
        ['loaders']: { ...state.loaders, ['assetDetails']: false },
      };
    case RecordAssetActionTypes.GET.ASSET_BY_ID_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['assetDetails']: false },
      };
    case RecordAssetActionTypes.GET.MAINTENANCE_UNITS:
      return {
        ...state,
        ['maintenanceUnits']: [],
      };
    case RecordAssetActionTypes.GET.MAINTENANCE_UNITS_SUCCESS:
      return {
        ...state,
        ['maintenanceUnits']: action.payload as IUnit[],
      };
    case RecordAssetActionTypes.SET.ASSET_ID:
      return { ...state, ['assetId']: action.payload as number };
    case RecordAssetActionTypes.SET.TERM_ID:
      return { ...state, ['termId']: action.payload as number };
    case RecordAssetActionTypes.SET.SELECTED_PLAN:
      return { ...state, ['selectedAssetPlan']: action.payload as ISelectedAssetPlan };
    case RecordAssetActionTypes.SET.SELECTED_VALUE_SERVICES:
      return {
        ...state,
        ['selectedValueServices']: getValueServicesArray(state, action.payload as ISelectedValueServices),
      };
    case RecordAssetActionTypes.RESET:
      return initialRecordAssetState;
    default:
      return state;
  }
};
