import { IAssetState } from '@homzhub/common/src/modules/asset/interfaces';
import { ICommonState } from '@homzhub/common/src/modules/common/interfaces';
import { IPortfolioState } from '@homzhub/common/src/modules/portfolio/interfaces';
import { IRecordAssetState } from '@homzhub/common/src/modules/recordAsset/interface';
import { ISearchState } from '@homzhub/common/src/modules/search/interface';
import { IUserState } from '@homzhub/common/src/modules/user/interface';
import { ITicketState } from '@homzhub/common/src/modules/tickets/interface';

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
  asset: IAssetState;
  common: ICommonState;
  portfolio: IPortfolioState;
  recordAsset: IRecordAssetState;
  search: ISearchState;
  ticket: ITicketState;
  user: IUserState;
}
