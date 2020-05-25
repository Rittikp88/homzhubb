/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';

const actionTypePrefix = 'OnBoarding/';

export const OnBoardingActionTypes = {
  GET: {
    ONBOARDING: `${actionTypePrefix}ONBOARDING`,
    ONBOARDING_SUCCESS: `${actionTypePrefix}ONBOARDING_SUCCESS`,
    ONBOARDING_FAILURE: `${actionTypePrefix}ONBOARDING_FAILURE`,
  },
};

const getOnBoardingDetail = (): IFluxStandardAction => {
  return {
    type: OnBoardingActionTypes.GET.ONBOARDING,
  };
};

const getOnBoardingSuccess = (data: any): IFluxStandardAction<any> => {
  return {
    type: OnBoardingActionTypes.GET.ONBOARDING_SUCCESS,
    payload: data,
  };
};

const getOnBoardingFailure = (error: string): IFluxStandardAction => {
  return {
    type: OnBoardingActionTypes.GET.ONBOARDING_FAILURE,
    error,
  };
};

export type OnBoardingPayloadTypes = string;
export const OnBoardingActions = {
  getOnBoardingDetail,
  getOnBoardingSuccess,
  getOnBoardingFailure,
};
