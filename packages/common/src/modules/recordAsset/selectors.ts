import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { AssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';

const getLoadingState = (state: IState): boolean => {
  const {
    recordAsset: {
      loaders: { assetPlan },
    },
  } = state;
  return assetPlan;
};

const getAssetPlans = (state: IState): AssetPlan[] => {
  const {
    recordAsset: { assetPlan },
  } = state;
  return ObjectMapper.deserializeArray(AssetPlan, assetPlan);
};

export const RecordAssetSelectors = {
  getLoadingState,
  getAssetPlans,
};
