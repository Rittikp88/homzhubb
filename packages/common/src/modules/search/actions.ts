/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IFilterDetails, IFilter, IPropertiesObject } from '@homzhub/common/src/domain/models/Search';

const actionTypePrefix = 'Search/';

export const SearchActionTypes = {
  GET: {
    FILTER_DETAILS: `${actionTypePrefix}FILTER_DETAILS`,
    FILTER_DETAILS_SUCCESS: `${actionTypePrefix}FILTER_DETAILS_SUCCESS`,
    FILTER_DETAILS_FAILURE: `${actionTypePrefix}FILTER_DETAILS_FAILURE`,
    PROPERTIES: `${actionTypePrefix}PROPERTIES`,
    PROPERTIES_SUCCESS: `${actionTypePrefix}PROPERTIES_SUCCESS`,
    PROPERTIES_FAILURE: `${actionTypePrefix}PROPERTIES_FAILURE`,
  },
  SET: {
    FILTER: `${actionTypePrefix}FILTER`,
  },
};

// TODO: Type to be added
const getFilterDetails = (payload: any): IFluxStandardAction<any> => {
  return {
    type: SearchActionTypes.GET.FILTER_DETAILS,
    payload,
  };
};

const getFilterDetailsSuccess = (data: IFilterDetails): IFluxStandardAction<IFilterDetails> => {
  return {
    type: SearchActionTypes.GET.FILTER_DETAILS_SUCCESS,
    payload: data,
  };
};

const getFilterDetailsFailure = (error: string): IFluxStandardAction => {
  return {
    type: SearchActionTypes.GET.FILTER_DETAILS_FAILURE,
    error,
  };
};

const setFilter = (payload: IFilter): IFluxStandardAction<IFilter> => {
  return {
    type: SearchActionTypes.SET.FILTER,
    payload,
  };
};

const getProperties = (): IFluxStandardAction => {
  return {
    type: SearchActionTypes.GET.PROPERTIES,
  };
};

const getPropertiesSuccess = (data: IPropertiesObject): IFluxStandardAction<IPropertiesObject> => {
  return {
    type: SearchActionTypes.GET.PROPERTIES_SUCCESS,
    payload: data,
  };
};

const getPropertiesFailure = (error: string): IFluxStandardAction => {
  return {
    type: SearchActionTypes.GET.PROPERTIES_FAILURE,
    error,
  };
};

export type SearchPayloadTypes = string | number | IPropertiesObject | IFilter | IFilterDetails | undefined;

export const SearchActions = {
  getFilterDetails,
  getFilterDetailsSuccess,
  getFilterDetailsFailure,
  setFilter,
  getProperties,
  getPropertiesSuccess,
  getPropertiesFailure,
};
