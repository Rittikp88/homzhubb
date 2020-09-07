import { ICallback } from '@homzhub/common/src/modules/interfaces';
import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { IAssetReview } from '@homzhub/common/src/domain/models/AssetReview';

export interface IAssetState {
  asset: IAsset | null;
  reviews: IAssetReview[];
  documents: AssetDocument[];
  error: {
    asset: string;
    reviews: string;
    documents: string;
  };
  loaders: {
    asset: boolean;
    reviews: boolean;
    documents: boolean;
  };
}

export interface IGetAssetPayload {
  propertyTermId: number;
  onCallback?: (params: ICallback) => void;
}

export interface IGetDocumentPayload {
  assetId: number;
  onCallback?: (params: ICallback) => void;
}
