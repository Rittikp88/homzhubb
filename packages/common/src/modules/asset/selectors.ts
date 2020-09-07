import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';

const getAssetReviews = (state: IState): AssetReview[] => {
  const {
    asset: { reviews },
  } = state;

  if (reviews.length <= 0) return [];

  return ObjectMapper.deserializeArray(AssetReview, reviews);
};

const getAsset = (state: IState): Asset | null => {
  const {
    asset: { asset },
  } = state;

  if (!asset) return null;
  return ObjectMapper.deserialize(Asset, asset);
};

const getLoadingState = (state: IState): boolean => {
  const {
    asset: {
      loaders: { asset },
    },
  } = state;
  return asset;
};

const getAssetDocuments = (state: IState): AssetDocument[] => {
  const {
    asset: { documents },
  } = state;
  if (documents.length <= 0) return [];
  return documents;
};

export const AssetSelectors = {
  getAssetReviews,
  getAsset,
  getLoadingState,
  getAssetDocuments,
};
