/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';

const actionTypePrefix = 'Property/';

export const PropertyActionTypes = {
  GET: {
    PROPERTY_DETAILS: `${actionTypePrefix}PROPERTY_DETAILS`,
    PROPERTY_DETAILS_SUCCESS: `${actionTypePrefix}PROPERTY_DETAILS_SUCCESS`,
    PROPERTY_DETAILS_FAILURE: `${actionTypePrefix}PROPERTY_DETAILS_FAILURE`,
    PROPERTY_DETAILS_BY_ID: `${actionTypePrefix}PROPERTY_DETAILS_BY_ID`,
    PROPERTY_DETAILS_BY_ID_SUCCESS: `${actionTypePrefix}PROPERTY_DETAILS_BY_ID_SUCCESS`,
    PROPERTY_DETAILS_BY_ID_FAILURE: `${actionTypePrefix}PROPERTY_DETAILS_BY_ID_FAILURE`,
  },
};

const getPropertyDetails = (): IFluxStandardAction => {
  return {
    type: PropertyActionTypes.GET.PROPERTY_DETAILS,
  };
};

const getPropertyDetailsSuccess = (data: any): IFluxStandardAction => {
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

const getPropertyDetailsById = (data: any): IFluxStandardAction => {
  return {
    type: PropertyActionTypes.GET.PROPERTY_DETAILS_BY_ID,
    payload: data,
  };
};

const getPropertyDetailsByIdSuccess = (data: any): IFluxStandardAction => {
  return {
    type: PropertyActionTypes.GET.PROPERTY_DETAILS_BY_ID_SUCCESS,
    payload: data,
  };
};

const getPropertyDetailsByIdFailure = (error: string): IFluxStandardAction => {
  return {
    type: PropertyActionTypes.GET.PROPERTY_DETAILS_BY_ID_FAILURE,
    error,
  };
};

export type PropertyPayloadTypes = string;
export const PropertyActions = {
  getPropertyDetails,
  getPropertyDetailsSuccess,
  getPropertyDetailsFailure,
  getPropertyDetailsById,
  getPropertyDetailsByIdSuccess,
  getPropertyDetailsByIdFailure,
};
