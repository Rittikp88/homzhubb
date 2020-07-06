/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IPropertyDetailsData, IRentServiceList } from '@homzhub/common/src/domain/models/Property';
import {
  IServiceDetail,
  IServiceListStepsDetail,
  IServiceListStepsPayload,
  IServiceCategory,
} from '@homzhub/common/src/domain/models/Service';

const actionTypePrefix = 'Property/';

export const PropertyActionTypes = {
  GET: {
    PROPERTY_DETAILS: `${actionTypePrefix}PROPERTY_DETAILS`,
    PROPERTY_DETAILS_SUCCESS: `${actionTypePrefix}PROPERTY_DETAILS_SUCCESS`,
    PROPERTY_DETAILS_FAILURE: `${actionTypePrefix}PROPERTY_DETAILS_FAILURE`,
    RENT_SERVICE_LIST: `${actionTypePrefix}RENT_SERVICE_LIST`,
    RENT_SERVICE_LIST_SUCCESS: `${actionTypePrefix}RENT_SERVICE_LIST_SUCCESS`,
    RENT_SERVICE_LIST_FAILURE: `${actionTypePrefix}RENT_SERVICE_LIST_FAILURE`,
    SERVICE_DETAILS: `${actionTypePrefix}SERVICE_DETAILS`,
    SERVICE_DETAILS_SUCCESS: `${actionTypePrefix}SERVICE_DETAILS_SUCCESS`,
    SERVICE_DETAILS_FAILURE: `${actionTypePrefix}SERVICE_DETAILS_FAILURE`,
    SERVICE_STEPS: `${actionTypePrefix}SERVICE_STEPS`,
    SERVICE_STEPS_SUCCESS: `${actionTypePrefix}SERVICE_STEPS_SUCCESS`,
    SERVICE_STEPS_FAILURE: `${actionTypePrefix}SERVICE_STEPS_FAILURE`,
  },
  SET: {
    CURRENT_PROPERTY_ID: `${actionTypePrefix}CURRENT_PROPERTY_ID`,
    TERM_ID: `${actionTypePrefix}TERM_ID`,
    SERVICE_CATEGORY: `${actionTypePrefix}SERVICE_CATEGORY`,
  },
};

const getPropertyDetails = (): IFluxStandardAction => {
  return {
    type: PropertyActionTypes.GET.PROPERTY_DETAILS,
  };
};

const getPropertyDetailsSuccess = (data: any): IFluxStandardAction<IPropertyDetailsData[]> => {
  return {
    type: PropertyActionTypes.GET.PROPERTY_DETAILS_SUCCESS,
    payload: data,
  };
};

const getPropertyDetailsFailure = (error: string): IFluxStandardAction => {
  return {
    type: PropertyActionTypes.GET.PROPERTY_DETAILS_FAILURE,
    error,
  };
};

const getRentServiceList = (): IFluxStandardAction => {
  return {
    type: PropertyActionTypes.GET.RENT_SERVICE_LIST,
  };
};

const getRentServiceListSuccess = (data: IRentServiceList[]): IFluxStandardAction<IRentServiceList[]> => {
  return {
    type: PropertyActionTypes.GET.RENT_SERVICE_LIST_SUCCESS,
    payload: data,
  };
};

const getRentServiceListFailure = (error: string): IFluxStandardAction<string> => {
  return {
    type: PropertyActionTypes.GET.RENT_SERVICE_LIST_FAILURE,
    error,
  };
};

const setCurrentPropertyId = (payload: number): IFluxStandardAction<number> => ({
  type: PropertyActionTypes.SET.CURRENT_PROPERTY_ID,
  payload,
});

const setTermId = (payload: number): IFluxStandardAction<number> => ({
  type: PropertyActionTypes.SET.TERM_ID,
  payload,
});

const setServiceCategory = (payload: IServiceCategory): IFluxStandardAction<IServiceCategory> => ({
  type: PropertyActionTypes.SET.SERVICE_CATEGORY,
  payload,
});

const getServiceDetails = (payload: number): IFluxStandardAction<number> => {
  return {
    type: PropertyActionTypes.GET.SERVICE_DETAILS,
    payload,
  };
};

const getServiceDetailsSuccess = (payload: IServiceDetail[]): IFluxStandardAction<IServiceDetail[]> => {
  return {
    type: PropertyActionTypes.GET.SERVICE_DETAILS_SUCCESS,
    payload,
  };
};

const getServiceDetailsFailure = (error: string): IFluxStandardAction<string> => {
  return {
    type: PropertyActionTypes.GET.SERVICE_DETAILS_FAILURE,
    error,
  };
};

const getServiceStepsDetails = (payload: IServiceListStepsPayload): IFluxStandardAction<IServiceListStepsPayload> => {
  return {
    type: PropertyActionTypes.GET.SERVICE_STEPS,
    payload,
  };
};

const getServiceStepsDetailsSuccess = (
  payload: IServiceListStepsDetail
): IFluxStandardAction<IServiceListStepsDetail> => {
  return {
    type: PropertyActionTypes.GET.SERVICE_STEPS_SUCCESS,
    payload,
  };
};

const getServiceStepsDetailsFailure = (error: string): IFluxStandardAction<string> => {
  return {
    type: PropertyActionTypes.GET.SERVICE_STEPS_FAILURE,
    error,
  };
};

export type PropertyPayloadTypes =
  | string
  | number
  | IPropertyDetailsData[]
  | IRentServiceList[]
  | IServiceDetail[]
  | IServiceListStepsDetail
  | IServiceCategory
  | undefined;
export const PropertyActions = {
  getPropertyDetails,
  getPropertyDetailsSuccess,
  getPropertyDetailsFailure,
  getRentServiceList,
  getRentServiceListSuccess,
  getRentServiceListFailure,
  getServiceDetails,
  getServiceDetailsSuccess,
  getServiceDetailsFailure,
  getServiceStepsDetails,
  getServiceStepsDetailsSuccess,
  getServiceStepsDetailsFailure,
  setCurrentPropertyId,
  setTermId,
  setServiceCategory,
};
