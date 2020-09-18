import { IUserState } from '@homzhub/common/src/modules/user/interface';
import { IAssetState } from '@homzhub/common/src/modules/asset/interfaces';
import { IPropertyState } from '@homzhub/common/src/modules/property/interface';
import { ISearchState } from '@homzhub/common/src/modules/search/interface';
import { IPortfolioState } from '@homzhub/common/src/modules/portfolio/interfaces';
import { IRecordAssetState } from '@homzhub/common/src/modules/recordAsset/interface';

export interface IFluxStandardAction<Payload = undefined, Error = string> {
  type: string;
  payload?: Payload;
  error?: Error;
}

export interface ICallback {
  status: boolean;
  message?: string;
}

export interface IState {
  user: IUserState;
  property: IPropertyState;
  search: ISearchState;
  asset: IAssetState;
  portfolio: IPortfolioState;
  recordAsset: IRecordAssetState;
}
