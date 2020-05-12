/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFluxStandardAction } from '../interfaces';

// TODO: For reference (remove)

const actionTypePrefix = 'Owner/';

export const OwnerActionTypes = {
  GET: {
    FETCH_GET_DETAIL: `${actionTypePrefix}FETCH_GET_DETAIL`,
    FETCH_GET_DETAIL_SUCCESS: `${actionTypePrefix}FETCH_GET_DETAIL_SUCCESS`,
    FETCH_GET_DETAIL_FAILURE: `${actionTypePrefix}FETCH_GET_DETAIL_FAILURE`,
  },
};

const getOwnerDetail = (): IFluxStandardAction => {
  return {
    type: OwnerActionTypes.GET.FETCH_GET_DETAIL,
  };
};

const getOwnerDetailSuccess = (data: any): IFluxStandardAction<any> => {
  return {
    type: OwnerActionTypes.GET.FETCH_GET_DETAIL_SUCCESS,
    payload: data,
  };
};

const getOwnerDetailFailure = (error: string): IFluxStandardAction<string> => {
  return {
    type: OwnerActionTypes.GET.FETCH_GET_DETAIL_FAILURE,
    payload: error,
  };
};

export const OwnerActions = {
  getOwnerDetail,
  getOwnerDetailSuccess,
  getOwnerDetailFailure,
};
