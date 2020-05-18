import { IOnboardingState } from '@homzhub/common/src/modules/onboarding/interface';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { OnboardingActionTypes } from '@homzhub/common/src/modules/onboarding/actions';
import { OnboardingData } from '@homzhub/common/src/mocks/onboarding';

export const initialOnboardingState: IOnboardingState = {
  data: OnboardingData, // TODO: To be changed to null when the api is ready
  error: {
    onboarding: '',
  },
  loaders: {
    onboarding: false,
  },
};

export const onboardingReducer = (
  state: IOnboardingState = initialOnboardingState,
  action: IFluxStandardAction
): IOnboardingState => {
  switch (action.type) {
    case OnboardingActionTypes.GET.ONBOARDING:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['onboarding']: true },
        ['error']: { ...state.error, ['onboarding']: '' },
      };
    case OnboardingActionTypes.GET.ONBOARDING_SUCCESS:
      return {
        ...state,
        // ['data']: action.payload, // TODO: To be changed to null when the api is ready
        ['loaders']: { ...state.loaders, ['onboarding']: false },
      };
    case OnboardingActionTypes.GET.ONBOARDING_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['onboarding']: false },
        ['error']: { ...state.error, ['onboarding']: '' },
      };
    default:
      return state;
  }
};
