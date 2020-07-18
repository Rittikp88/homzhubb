/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IFilterDetails } from '@homzhub/common/src/domain/models/Search';

const actionTypePrefix = 'Search/';

export const SearchActionTypes = {
  GET: {
    FILTER_DETAILS: `${actionTypePrefix}FILTER_DETAILS`,
    FILTER_DETAILS_SUCCESS: `${actionTypePrefix}FILTER_DETAILS_SUCCESS`,
    FILTER_DETAILS_FAILURE: `${actionTypePrefix}FILTER_DETAILS_FAILURE`,
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

// TODO: Type to be added
const setFilter = (payload: any): IFluxStandardAction<any> => {
  return {
    type: SearchActionTypes.SET.FILTER,
    payload,
  };
};

export const SearchActions = {
  getFilterDetails,
  getFilterDetailsSuccess,
  getFilterDetailsFailure,
  setFilter,
};
