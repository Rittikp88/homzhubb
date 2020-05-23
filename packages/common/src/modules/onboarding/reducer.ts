import { IOnBoardingState } from '@homzhub/common/src/modules/onboarding/interface';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { OnboardingActionTypes } from '@homzhub/common/src/modules/onboarding/actions';

export const initialOnBoardingState: IOnBoardingState = {
  data: null,
  error: {
    onBoarding: '',
  },
  loaders: {
    onBoarding: false,
  },
};

export const onBoardingReducer = (
  state: IOnBoardingState = initialOnBoardingState,
  action: IFluxStandardAction
): IOnBoardingState => {
  switch (action.type) {
    case OnboardingActionTypes.GET.ONBOARDING:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['onBoarding']: true },
        ['error']: { ...state.error, ['onBoarding']: '' },
      };
    case OnboardingActionTypes.GET.ONBOARDING_SUCCESS:
      return {
        ...state,
        ['data']: action.payload,
        ['loaders']: { ...state.loaders, ['onBoarding']: false },
      };
    case OnboardingActionTypes.GET.ONBOARDING_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['onBoarding']: false },
        ['error']: { ...state.error, ['onBoarding']: '' },
      };
    default:
      return state;
  }
};
