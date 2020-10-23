import { ICallback } from '@homzhub/common/src/modules/interfaces';
import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { AssetDocument } from '@homzhub/common/src/domain/models/AssetDocument';
import { ICount } from '@homzhub/common/src/domain/models/AssetMetrics';
import { IAssetReview } from '@homzhub/common/src/domain/models/AssetReview';
import { IAssetVisit } from '@homzhub/common/src/domain/models/AssetVisit';

export interface IAssetState {
  asset: IAsset | null;
  reviews: IAssetReview[];
  documents: AssetDocument[];
  visits: IAssetVisit[];
  visitIds: number[];
  assetCount: ICount | null;
  error: {
    asset: string;
    reviews: string;
    documents: string;
    visits: string;
  };
  loaders: {
    asset: boolean;
    reviews: boolean;
    documents: boolean;
    visits: boolean;
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
