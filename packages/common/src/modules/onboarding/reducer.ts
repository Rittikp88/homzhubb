import { IOnBoardingState } from '@homzhub/common/src/modules/onboarding/interface';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { OnBoardingActionTypes, OnBoardingPayloadTypes } from '@homzhub/common/src/modules/onboarding/actions';
import { IOnboardingData } from '@homzhub/common/src/domain/models/Onboarding';

export const initialOnBoardingState: IOnBoardingState = {
  data: [],
  error: {
    onBoarding: '',
  },
  loaders: {
    onBoarding: false,
  },
};

export const onBoardingReducer = (
  state: IOnBoardingState = initialOnBoardingState,
  action: IFluxStandardAction<OnBoardingPayloadTypes>
): IOnBoardingState => {
  switch (action.type) {
    case OnBoardingActionTypes.GET.ONBOARDING:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['onBoarding']: true },
        ['error']: { ...state.error, ['onBoarding']: '' },
      };
    case OnBoardingActionTypes.GET.ONBOARDING_SUCCESS:
      return {
        ...state,
        ['data']: action.payload as IOnboardingData[],
        ['loaders']: { ...state.loaders, ['onBoarding']: false },
      };
    case OnBoardingActionTypes.GET.ONBOARDING_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['onBoarding']: false },
        ['error']: { ...state.error, ['onBoarding']: action.error as string },
      };
    default:
      return state;
  }
};
