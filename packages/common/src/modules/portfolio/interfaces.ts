import { ICallback } from '@homzhub/common/src/modules/interfaces';
import { Asset, DataType } from '@homzhub/common/src/domain/models/Asset';
import { TenantHistory } from '@homzhub/common/src/domain/models/TenantHistory';

export interface IDataObject {
  [id: number]: Asset;
}

export interface IPortfolioState {
  tenancies: IDataObject | null;
  properties: IDataObject | null;
  currentAsset: ISetAssetPayload;
  tenantHistory: TenantHistory[] | null;
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
