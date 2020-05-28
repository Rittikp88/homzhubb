import { IState } from '@homzhub/common/src/modules/interfaces';
import { IOnboardingData } from '@homzhub/common/src/domain/models/Onboarding';

const getOnboardingData = (state: IState): IOnboardingData[] => {
  const {
    onBoarding: { data },
  } = state;
  return data;
};

export const OnboardingSelector = {
  getOnboardingData,
};
