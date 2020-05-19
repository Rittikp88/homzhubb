import { IOwnerState } from '@homzhub/common/src/modules/owner/interface';
import { IOnboardingState } from '@homzhub/common/src/modules/onboarding/interface';
import { IUserState } from '@homzhub/common/src/modules/user/interface';

export interface IFluxStandardAction<Payload = undefined, Error = string> {
  type: string;
  payload?: Payload;
  error?: Error;
}

export interface IState {
  owner: IOwnerState;
  onboarding: IOnboardingState;
  user: IUserState;
}
