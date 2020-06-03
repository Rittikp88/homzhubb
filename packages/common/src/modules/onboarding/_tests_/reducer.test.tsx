import { onBoardingReducer as reducer, initialOnBoardingState } from '@homzhub/common/src/modules/onboarding/reducer';
import { OnBoardingActions } from '@homzhub/common/src/modules/onboarding/actions';
import { OnboardingData } from '@homzhub/common/src/mocks/onboarding';

describe('Onboarding Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(initialOnBoardingState, { type: 'INITIAL_STATE' })).toEqual(initialOnBoardingState);
  });

  it('should handle Get Onboarding', () => {
    const state = reducer(initialOnBoardingState, OnBoardingActions.getOnBoardingDetail());
    expect(state).toStrictEqual({
      ...initialOnBoardingState,
      ['loaders']: { ...state.loaders, ['onBoarding']: true },
      ['error']: { ...state.error, ['onBoarding']: '' },
    });
  });

  it('should handle Get Onboarding Success', () => {
    const state = reducer(initialOnBoardingState, OnBoardingActions.getOnBoardingSuccess(OnboardingData));
    expect(state).toStrictEqual({
      ...initialOnBoardingState,
      ['data']: OnboardingData,
      ['loaders']: { ...state.loaders, ['onBoarding']: false },
    });
  });

  it('should handle Get Onboarding failure', () => {
    const state = reducer(initialOnBoardingState, OnBoardingActions.getOnBoardingFailure('Test Error'));
    expect(state).toStrictEqual({
      ...initialOnBoardingState,
      ['loaders']: { ...state.loaders, ['onBoarding']: false },
      ['error']: { ...state.error, ['onBoarding']: 'Test Error' },
    });
  });
});
