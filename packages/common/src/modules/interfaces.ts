import { IOwnerState } from './owner/interface';

export interface IFluxStandardAction<Payload = undefined, Error = string> {
  type: string;
  payload?: Payload;
  error?: Error;
}

// TODO: For reference (remove)

export interface IState {
  owner: IOwnerState;
}
