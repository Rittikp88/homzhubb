import { IUserState } from '@homzhub/common/src/modules/user/interface';
import { IPropertyState } from '@homzhub/common/src/modules/property/interface';
import { IServiceState } from '@homzhub/common/src/modules/service/interface';

export interface IFluxStandardAction<Payload = undefined, Error = string> {
  type: string;
  payload?: Payload;
  error?: Error;
}

export interface IState {
  user: IUserState;
  property: IPropertyState;
  service: IServiceState;
}
