/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IPropertyDetailsData, IRentServiceList } from '@homzhub/common/src/domain/models/Property';

const actionTypePrefix = 'Property/';

export const PropertyActionTypes = {
  GET: {
    PROPERTY_DETAILS: `${actionTypePrefix}PROPERTY_DETAILS`,
    PROPERTY_DETAILS_SUCCESS: `${actionTypePrefix}PROPERTY_DETAILS_SUCCESS`,
    PROPERTY_DETAILS_FAILURE: `${actionTypePrefix}PROPERTY_DETAILS_FAILURE`,
    RENT_SERVICE_LIST: `${actionTypePrefix}RENT_SERVICE_LIST`,
    RENT_SERVICE_LIST_SUCCESS: `${actionTypePrefix}RENT_SERVICE_LIST_SUCCESS`,
    RENT_SERVICE_LIST_FAILURE: `${actionTypePrefix}RENT_SERVICE_LIST_FAILURE`,
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

export type PropertyPayloadTypes = string | IPropertyDetailsData[] | IRentServiceList[] | undefined;
export const PropertyActions = {
  getPropertyDetails,
  getPropertyDetailsSuccess,
  getPropertyDetailsFailure,
  getRentServiceList,
  getRentServiceListSuccess,
  getRentServiceListFailure,
};
