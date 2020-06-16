/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IServiceDetail, IServiceListStepsDetail } from '@homzhub/common/src/domain/models/Service';
import { IServiceParam } from '@homzhub/common/src/domain/repositories/interfaces';

const actionTypePrefix = 'Service/';

export const ServiceActionTypes = {
  GET: {
    SERVICE_DETAILS: `${actionTypePrefix}SERVICE_DETAILS`,
    SERVICE_DETAILS_SUCCESS: `${actionTypePrefix}SERVICE_DETAILS_SUCCESS`,
    SERVICE_DETAILS_FAILURE: `${actionTypePrefix}SERVICE_DETAILS_FAILURE`,
    SERVICE_STEPS: `${actionTypePrefix}SERVICE_STEPS`,
    SERVICE_STEPS_SUCCESS: `${actionTypePrefix}SERVICE_STEPS_SUCCESS`,
    SERVICE_STEPS_FAILURE: `${actionTypePrefix}SERVICE_STEPS_FAILURE`,
  },
};

const getServiceDetails = (payload: IServiceParam): IFluxStandardAction<IServiceParam> => {
  return {
    type: ServiceActionTypes.GET.SERVICE_DETAILS,
    payload,
  };
};

const getServiceDetailsSuccess = (payload: IServiceDetail[]): IFluxStandardAction<IServiceDetail[]> => {
  return {
    type: ServiceActionTypes.GET.SERVICE_DETAILS_SUCCESS,
    payload,
  };
};

const getServiceDetailsFailure = (error: string): IFluxStandardAction<string> => {
  return {
    type: ServiceActionTypes.GET.SERVICE_DETAILS_FAILURE,
    error,
  };
};

const getServiceStepsDetails = (payload: number): IFluxStandardAction<number> => {
  return {
    type: ServiceActionTypes.GET.SERVICE_STEPS,
    payload,
  };
};

const getServiceStepsDetailsSuccess = (
  payload: IServiceListStepsDetail[]
): IFluxStandardAction<IServiceListStepsDetail[]> => {
  return {
    type: ServiceActionTypes.GET.SERVICE_STEPS_SUCCESS,
    payload,
  };
};

const getServiceStepsDetailsFailure = (error: string): IFluxStandardAction<string> => {
  return {
    type: ServiceActionTypes.GET.SERVICE_STEPS_FAILURE,
    error,
  };
};

export type ServicePayloadTypes = string | number | IServiceDetail[] | IServiceListStepsDetail[];
export const ServiceActions = {
  getServiceDetails,
  getServiceDetailsSuccess,
  getServiceDetailsFailure,
  getServiceStepsDetails,
  getServiceStepsDetailsSuccess,
  getServiceStepsDetailsFailure,
};
