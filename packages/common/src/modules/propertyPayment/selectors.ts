import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Society } from '@homzhub/common/src/domain/models/Society';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IPropertyPaymentState, ISocietyFormData } from '@homzhub/common/src/modules/propertyPayment/interfaces';

const getSelectedAssetId = (state: IState): number => {
  const {
    propertyPayment: { selectedAssetId },
  } = state;
  return selectedAssetId;
};

const getSelectedAsset = (state: IState): Asset => {
  const {
    propertyPayment: { selectedAssetId },
    asset: { activeAssets },
  } = state;
  if (!selectedAssetId) return new Asset();
  const selectedAsset = activeAssets.find((item) => item.id === selectedAssetId);
  if (!selectedAsset) return new Asset();
  return ObjectMapper.deserialize(Asset, selectedAsset);
};

const getSocieties = (state: IState): Society[] => {
  const {
    propertyPayment: { societies },
  } = state;
  if (societies.length < 1) return [];
  return ObjectMapper.deserializeArray(Society, societies);
};

const getPropertyPaymentLoaders = (state: IState): IPropertyPaymentState['loaders'] => {
  return state.propertyPayment.loaders;
};

const getSocietyFormData = (state: IState): ISocietyFormData => {
  const {
    propertyPayment: { societyFormData },
  } = state;

  const asset = getSelectedAsset(state);

  return {
    ...societyFormData,
    projectName: asset.project?.name ?? '',
    propertyName: asset.projectName,
  };
};

export const PropertyPaymentSelector = {
  getSelectedAssetId,
  getSelectedAsset,
  getSocieties,
  getPropertyPaymentLoaders,
  getSocietyFormData,
};
