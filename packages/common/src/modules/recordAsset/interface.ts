import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IAssetGroup } from '@homzhub/common/src/domain/models/AssetGroup';
import { IAssetPlan, ISelectedAssetPlan } from '@homzhub/common/src/domain/models/AssetPlan';
import { IUnit } from '@homzhub/common/src/domain/models/Unit';
import { IValueAddedServices } from '@homzhub/common/src/domain/models/ValueAddedService';

export interface IRecordAssetState {
  assetId: number;
  termId: number;
  assetDetails: IAsset | null;
  assetPlan: IAssetPlan[];
  assetGroups: IAssetGroup[];
  maintenanceUnits: IUnit[];
  selectedAssetPlan: ISelectedAssetPlan;
  valueAddedServices: IValueAddedServices[];
  error: {
    assetPlan: string;
  };
  loaders: {
    assetPlan: boolean;
    assetGroups: boolean;
    assetDetails: boolean;
  };
}
