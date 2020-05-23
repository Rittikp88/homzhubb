/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';

const actionTypePrefix = 'OnBoarding/';

export const OnboardingActionTypes = {
  GET: {
    ONBOARDING: `${actionTypePrefix}ONBOARDING`,
    ONBOARDING_SUCCESS: `${actionTypePrefix}ONBOARDING_SUCCESS`,
    ONBOARDING_FAILURE: `${actionTypePrefix}ONBOARDING_FAILURE`,
  },
};

const getOnBoardingDetail = (): IFluxStandardAction => {
  return {
    type: OnboardingActionTypes.GET.ONBOARDING,
  };
};

const getOnBoardingSuccess = (data: any): IFluxStandardAction<any> => {
  return {
    type: OnboardingActionTypes.GET.ONBOARDING_SUCCESS,
    payload: data,
  };
};

const getOnBoardingFailure = (error: string): IFluxStandardAction<string> => {
  return {
    type: OnboardingActionTypes.GET.ONBOARDING_FAILURE,
    payload: error,
  };
};

export const OnBoardingActions = {
  getOnBoardingDetail,
  getOnBoardingSuccess,
  getOnBoardingFailure,
};
