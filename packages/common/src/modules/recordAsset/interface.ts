import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IAssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';
import { IAssetPlan, ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { ISelectedValueServices } from '@homzhub/common/src/domain/models/ValueAddedService';
import { IUnit } from '@homzhub/common/src/domain/models/Unit';

export interface IRecordAssetState {
  assetId: number;
  termId: number;
  assetDetails: IAsset | null;
  assetPlan: IAssetPlan[];
  assetGroups: IAssetGroup[];
  maintenanceUnits: IUnit[];
  selectedAssetPlan: ISelectedAssetPlan;
  selectedValueServices: ISelectedValueServices[];
  error: {
    assetPlan: string;
  };
  loaders: {
    assetPlan: boolean;
    assetGroups: boolean;
    assetDetails: boolean;
  };
}
