import { Asset } from '@homzhub/common/src/domain/models/Asset';
import { IAssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';
import { IAssetPlan, ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';

export interface IRecordAssetState {
  assetId: number;
  assetDetails: Asset | null;
  assetPlan: IAssetPlan[];
  assetGroups: IAssetGroup[];
  selectedAssetPlan: ISelectedAssetPlan;
  error: {
    assetPlan: string;
  };
  loaders: {
    assetPlan: boolean;
    assetGroups: boolean;
    assetDetails: boolean;
  };
}
