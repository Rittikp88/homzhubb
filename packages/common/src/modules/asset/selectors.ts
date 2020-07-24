import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { AssetReview } from '@homzhub/common/src/domain/models/AssetReview';

const getAssetReviews = (state: IState): AssetReview[] => {
  const {
    asset: { reviews },
  } = state;

  if (reviews.length <= 0) return [];

  return ObjectMapper.deserializeArray(AssetReview, reviews);
};

export const AssetSelectors = {
  getAssetReviews,
};
