import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IState } from '@homzhub/common/src/modules/interfaces';

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

export const PropertyPaymentSelector = {
  getSelectedAssetId,
  getSelectedAsset,
};
