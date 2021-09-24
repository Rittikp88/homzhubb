import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { Society } from '@homzhub/common/src/domain/models/Society';
import { IBankInfoPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { IPropertyPaymentState, ISocietyFormData } from '@homzhub/common/src/modules/propertyPayment/interfaces';

const getSelectedAssetId = (state: IState): number => {
  const {
    propertyPayment: { selectedAssetId },
  } = state;
  return selectedAssetId;
};

const getSelectedAsset = (state: IState): Asset => {
  const assetId = getSelectedAssetId(state);
  const activeAssets = AssetSelectors.getUserActiveAssets(state);
  if (!assetId) return new Asset();
  const selectedAsset = activeAssets.find((item) => item.id === assetId);
  if (!selectedAsset) return new Asset();

  return selectedAsset;
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

const getSocietyBankData = (state: IState): IBankInfoPayload | null => {
  const {
    propertyPayment: { societyBankData },
  } = state;

  return societyBankData;
};

const getSocietyDetails = (state: IState): Society | null => {
  const {
    propertyPayment: { societyDetail },
  } = state;

  if (!societyDetail) return null;

  return ObjectMapper.deserialize(Society, societyDetail);
};

const getSelectedSocietyId = (state: IState): number => {
  const {
    propertyPayment: { selectedSocietyId },
  } = state;
  return selectedSocietyId;
};

export const PropertyPaymentSelector = {
  getSelectedAssetId,
  getSelectedAsset,
  getSocieties,
  getPropertyPaymentLoaders,
  getSocietyFormData,
  getSocietyBankData,
  getSocietyDetails,
  getSelectedSocietyId,
};
