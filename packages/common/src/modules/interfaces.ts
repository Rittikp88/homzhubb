import { IOnboardingState } from '@homzhub/common/src/modules/onboarding/interface';
import { IUserState } from '@homzhub/common/src/modules/user/interface';

export interface IFluxStandardAction<Payload = undefined, Error = string> {
  type: string;
  payload?: Payload;
  error?: Error;
}

export interface IState {
  onboarding: IOnboardingState;
  user: IUserState;
}
