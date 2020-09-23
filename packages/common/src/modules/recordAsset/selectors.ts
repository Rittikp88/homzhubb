import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { AssetGroup, SpaceType } from '@homzhub/common/src/domain/models/AssetGroup';
import { AssetPlan, ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';

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

const getAssetGroups = (state: IState): AssetGroup[] => {
  const {
    recordAsset: { assetGroups },
  } = state;
  return ObjectMapper.deserializeArray(AssetGroup, assetGroups);
};

const getSpaceTypes = (state: IState): SpaceType[] => {
  const {
    recordAsset: { assetGroups, assetId },
  } = state;
  const spaceType: SpaceType[] = [];

  ObjectMapper.deserializeArray(AssetGroup, assetGroups).forEach((item) => {
    const assetIds = item.assetTypes.map((asset) => asset.id);

    if (assetIds.includes(assetId)) {
      spaceType.concat(item.spaceTypes);
    }
  });

  return spaceType;
};

const getCurrentAssetId = (state: IState): number => {
  const {
    recordAsset: { assetId },
  } = state;
  return assetId;
};

const getAssetGroupsLoading = (state: IState): boolean => {
  const {
    recordAsset: {
      loaders: { assetGroups },
    },
  } = state;
  return assetGroups;
};

const getSelectedAssetPlan = (state: IState): ISelectedAssetPlan => {
  const {
    recordAsset: { selectedAssetPlan },
  } = state;
  return selectedAssetPlan;
};

export const RecordAssetSelectors = {
  getLoadingState,
  getAssetPlans,
  getAssetGroups,
  getAssetGroupsLoading,
  getCurrentAssetId,
  getSelectedAssetPlan,
  getSpaceTypes,
};
