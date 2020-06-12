/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IServiceDetail } from '@homzhub/common/src/domain/models/Service';

const actionTypePrefix = 'Service/';

export const ServiceActionTypes = {
  GET: {
    SERVICE_DETAILS: `${actionTypePrefix}SERVICE_DETAILS`,
    SERVICE_DETAILS_SUCCESS: `${actionTypePrefix}SERVICE_DETAILS_SUCCESS`,
    SERVICE_DETAILS_FAILURE: `${actionTypePrefix}SERVICE_DETAILS_FAILURE`,
  },
};

const getServiceDetails = (): IFluxStandardAction => {
  return {
    type: ServiceActionTypes.GET.SERVICE_DETAILS,
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

export type ServicePayloadTypes = string | IServiceDetail[];
export const ServiceActions = {
  getServiceDetails,
  getServiceDetailsSuccess,
  getServiceDetailsFailure,
};
