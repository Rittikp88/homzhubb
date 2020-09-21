/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';

const actionTypePrefix = 'Property/';

export const PropertyActionTypes = {
  GET: {
    PROPERTY_DETAILS: `${actionTypePrefix}PROPERTY_DETAILS`,
    PROPERTY_DETAILS_SUCCESS: `${actionTypePrefix}PROPERTY_DETAILS_SUCCESS`,
    PROPERTY_DETAILS_FAILURE: `${actionTypePrefix}PROPERTY_DETAILS_FAILURE`,
  },
  SET: {
    CURRENT_PROPERTY_ID: `${actionTypePrefix}CURRENT_PROPERTY_ID`,
    TERM_ID: `${actionTypePrefix}TERM_ID`,
    INITIAL_STATE: `${actionTypePrefix}INITIAL_STATE`,
  },
};

const getPropertyDetails = (): IFluxStandardAction => {
  return {
    type: PropertyActionTypes.GET.PROPERTY_DETAILS,
  };
};

const getPropertyDetailsSuccess = (data: any): IFluxStandardAction<[]> => {
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

const setCurrentPropertyId = (payload: number): IFluxStandardAction<number> => ({
  type: PropertyActionTypes.SET.CURRENT_PROPERTY_ID,
  payload,
});

const setTermId = (payload: number): IFluxStandardAction<number> => ({
  type: PropertyActionTypes.SET.TERM_ID,
  payload,
});

const setPropertyInitialState = (): IFluxStandardAction => {
  return {
    type: PropertyActionTypes.SET.INITIAL_STATE,
  };
};

export type PropertyPayloadTypes = string | number | undefined;

export const PropertyActions = {
  getPropertyDetails,
  getPropertyDetailsSuccess,
  getPropertyDetailsFailure,
  setCurrentPropertyId,
  setTermId,
  setPropertyInitialState,
};
