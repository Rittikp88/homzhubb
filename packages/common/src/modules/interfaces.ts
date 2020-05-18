import { IOwnerState } from '@homzhub/common/src/modules/owner/interface';
import { IOnboardingState } from '@homzhub/common/src/modules/onboarding/interface';

export interface IFluxStandardAction<Payload = undefined, Error = string> {
  type: string;
  payload?: Payload;
  error?: Error;
}

// TODO: For reference (remove)

export interface IState {
  owner: IOwnerState;
  onboarding: IOnboardingState;
}
