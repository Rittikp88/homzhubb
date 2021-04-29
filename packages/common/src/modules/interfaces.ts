import { CallEffect, PutEffect, SelectEffect } from '@redux-saga/core/effects';
import { IAssetState } from '@homzhub/common/src/modules/asset/interfaces';
import { ICommonState } from '@homzhub/common/src/modules/common/interfaces';
import { IOfferState } from '@homzhub/common/src/modules/offers/interfaces';
import { IPortfolioState } from '@homzhub/common/src/modules/portfolio/interfaces';
import { IRecordAssetState } from '@homzhub/common/src/modules/recordAsset/interface';
import { ISearchState } from '@homzhub/common/src/modules/search/interface';
import { ITicketState } from '@homzhub/common/src/modules/tickets/interface';
import { IUserState } from '@homzhub/common/src/modules/user/interface';

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
  offer: IOfferState;
  user: IUserState;
}

export type GeneratorEffects = SelectEffect | PutEffect | CallEffect;

export type VoidGenerator = Generator<GeneratorEffects, void>;
