import { ICallback } from '@homzhub/common/src/modules/interfaces';
import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IAssetReview } from '@homzhub/common/src/domain/models/AssetReview';

export interface IAssetState {
  asset: IAsset | null;
  reviews: IAssetReview[];
  error: {
    asset: string;
    reviews: string;
  };
  loaders: {
    asset: boolean;
    reviews: boolean;
  };
}

export interface IGetAssetPayload {
  propertyTermId: number;
  onCallback?: (params: ICallback) => void;
}
