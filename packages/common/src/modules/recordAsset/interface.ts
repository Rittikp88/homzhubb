import { IAssetPlan, ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { IAssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';

export interface IRecordAssetState {
  assetId: number;
  assetPlan: IAssetPlan[];
  assetGroups: IAssetGroup[];
  selectedAssetPlan: ISelectedAssetPlan;
  error: {
    assetPlan: string;
  };
  loaders: {
    assetPlan: boolean;
    assetGroups: boolean;
  };
}
