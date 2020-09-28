import { ICallback } from '@homzhub/common/src/modules/interfaces';
import { Asset, DataType } from '@homzhub/common/src/domain/models/Asset';
import { Filters } from '@homzhub/common/src/domain/models/AssetFilter';
import { TenantHistory } from '@homzhub/common/src/domain/models/Tenant';

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

export interface IGetHistoryPayload {
  id: number;
  onCallback: (params: ICallback) => void;
}

export interface ISetAssetPayload {
  id: number;
  dataType: DataType;
}
