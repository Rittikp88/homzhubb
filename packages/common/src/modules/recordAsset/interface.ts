import { IAssetPlan, ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';

export interface IRecordAssetState {
  assetPlan: IAssetPlan[];
  selectedAssetPlan: ISelectedAssetPlan;
  error: {
    assetPlan: string;
  };
  loaders: {
    assetPlan: boolean;
  };
}
