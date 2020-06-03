import { OnBoardingActions, OnBoardingActionTypes } from '@homzhub/common/src/modules/onboarding/actions';
import { OnboardingData } from '@homzhub/common/src/mocks/onboarding';

describe('Onboarding Actions', () => {
  it('should call get onboarding detail action', () => {
    const action = OnBoardingActions.getOnBoardingDetail();
    expect(action).toStrictEqual({
      type: OnBoardingActionTypes.GET.ONBOARDING,
    });
  });

  it('should call get onboarding success action', () => {
    const action = OnBoardingActions.getOnBoardingSuccess(OnboardingData);
    expect(action).toStrictEqual({
      type: OnBoardingActionTypes.GET.ONBOARDING_SUCCESS,
      payload: OnboardingData,
    });
  });

  it('should call get onboarding failure action', () => {
    const action = OnBoardingActions.getOnBoardingFailure('Test Error');
    expect(action).toStrictEqual({
      type: OnBoardingActionTypes.GET.ONBOARDING_FAILURE,
      error: 'Test Error',
    });
  });
});
