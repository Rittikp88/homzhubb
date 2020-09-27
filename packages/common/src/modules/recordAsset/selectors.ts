import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
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
    recordAsset: { assetGroups, assetDetails },
  } = state;
  let spaceType: SpaceType[] = [];

  ObjectMapper.deserializeArray(AssetGroup, assetGroups).forEach((item) => {
    if (assetDetails?.asset_group.id === item.id) {
      spaceType = item.spaceTypes;
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

const getCurrentTermId = (state: IState): number => {
  const {
    recordAsset: { termId },
  } = state;
  return termId;
};

const getAssetDetails = (state: IState): Asset | null => {
  const {
    recordAsset: { assetDetails },
  } = state;
  return ObjectMapper.deserialize(Asset, assetDetails);
};

export const RecordAssetSelectors = {
  getLoadingState,
  getAssetPlans,
  getAssetGroups,
  getAssetGroupsLoading,
  getCurrentAssetId,
  getSelectedAssetPlan,
  getSpaceTypes,
  getAssetDetails,
  getCurrentTermId,
};
