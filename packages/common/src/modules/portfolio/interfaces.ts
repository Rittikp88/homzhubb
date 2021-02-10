import { Asset, DataType } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { TenantHistory } from '@homzhub/common/src/domain/models/Tenant';
import { DetailType } from '@homzhub/common/src/domain/repositories/interfaces';
import { ICallback } from '@homzhub/common/src/modules/interfaces';

export interface IDataObject {
  [id: number]: Asset;
}

export interface IPortfolioState {
  tenancies: IDataObject | null;
  properties: IDataObject | null;
  currentAsset: ISetAssetPayload;
  tenantHistory: TenantHistory[] | null;
  currentFilter: Filters;
  error: {
    tenancies: string;
    properties: string;
    history: string;
  };
  loaders: {
    tenancies: boolean;
    properties: boolean;
    history: boolean;
  };
}

export interface IGetPropertiesPayload {
  status: string;
  onCallback: (params: ICallback) => void;
}

export interface IGetTenanciesPayload {
  onCallback: (params: ICallback) => void;
}

export interface IGetHistoryParam {
  id: number;
  onCallback: (params: ICallback) => void;
  data?: IGetHistoryPayload;
}

export interface IGetHistoryPayload {
  sort_by?: string;
}

export interface ISetAssetPayload {
  asset_id: number;
  listing_id: number;
  assetType: DetailType;
  dataType?: DataType;
  lease_listing_id?: number | null;
  sale_listing_id?: number | null;
}
