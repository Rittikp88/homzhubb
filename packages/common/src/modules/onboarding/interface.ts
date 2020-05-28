import { IOnboardingData } from '@homzhub/common/src/domain/models/Onboarding';

export interface IOnBoardingState {
  data: IOnboardingData[];
  error: {
    onBoarding: string;
  };
  loaders: {
    onBoarding: boolean;
  };
}
