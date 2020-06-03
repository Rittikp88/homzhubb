import { IState } from '@homzhub/common/src/modules/interfaces';
import { OnboardingData } from '@homzhub/common/src/mocks/onboarding';
import { OnboardingSelector } from '@homzhub/common/src/modules/onboarding/selectors';
import { initialUserState } from '@homzhub/common/src/modules/user/reducer';
import { initialPropertyState } from '@homzhub/common/src/modules/property/reducer';
import { initialOnBoardingState } from '@homzhub/common/src/modules/onboarding/reducer';

const state: IState = {
  onBoarding: {
    ...initialOnBoardingState,
    data: OnboardingData,
  },
  user: {
    ...initialUserState,
  },
  property: {
    ...initialPropertyState,
  },
};

describe('Onboarding Selector', () => {
  it('should return the onboarding data', () => {
    expect(OnboardingSelector.getOnboardingData(state)).toBe(OnboardingData);
  });
});
