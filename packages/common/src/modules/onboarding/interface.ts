import { IOnboarding } from '@homzhub/common/src/domain/repositories/onboarding/Interfaces';

export interface IOnboardingState {
  data: IOnboarding[];
  error: {
    onboarding: string;
  };
  loaders: {
    onboarding: boolean;
  };
}
