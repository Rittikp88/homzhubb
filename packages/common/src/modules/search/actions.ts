/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ObjectMapper } from '@homzhub/common/src/utils/ObjectMapper';
import { IFilterDetails, IFilter } from '@homzhub/common/src/domain/models/Search';
import { IAssetSearch, AssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';

const actionTypePrefix = 'Search/';

export const SearchActionTypes = {
  GET: {
    FILTER_DETAILS: `${actionTypePrefix}FILTER_DETAILS`,
    FILTER_DETAILS_SUCCESS: `${actionTypePrefix}FILTER_DETAILS_SUCCESS`,
    FILTER_DETAILS_FAILURE: `${actionTypePrefix}FILTER_DETAILS_FAILURE`,
    PROPERTIES: `${actionTypePrefix}PROPERTIES`,
    PROPERTIES_SUCCESS: `${actionTypePrefix}PROPERTIES_SUCCESS`,
    PROPERTIES_FAILURE: `${actionTypePrefix}PROPERTIES_FAILURE`,
    PROPERTIES_LIST_VIEW: `${actionTypePrefix}PROPERTIES_LIST_VIEW`,
    PROPERTIES_LIST_VIEW_SUCCESS: `${actionTypePrefix}PROPERTIES_LIST_VIEW_SUCCESS`,
    PROPERTIES_LIST_VIEW_FAILURE: `${actionTypePrefix}PROPERTIES_LIST_VIEW_FAILURE`,
  },
  SET: {
    FILTER: `${actionTypePrefix}FILTER`,
    INITIAL_FILTERS: `${actionTypePrefix}INITIAL_FILTERS`,
    INITIAL_STATE: `${actionTypePrefix}INITIAL_STATE`,
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

const getPropertiesSuccess = (asset: AssetSearch): IFluxStandardAction<IAssetSearch> => {
  return {
    type: SearchActionTypes.GET.PROPERTIES_SUCCESS,
    payload: ObjectMapper.serialize(asset),
  };
};

const getPropertiesFailure = (error: string): IFluxStandardAction => {
  return {
    type: SearchActionTypes.GET.PROPERTIES_FAILURE,
    error,
  };
};

const setInitialFilters = (): IFluxStandardAction => {
  return {
    type: SearchActionTypes.SET.INITIAL_FILTERS,
  };
};

const setInitialState = (): IFluxStandardAction => {
  return {
    type: SearchActionTypes.SET.INITIAL_STATE,
  };
};

const getPropertiesListView = (): IFluxStandardAction => {
  return {
    type: SearchActionTypes.GET.PROPERTIES_LIST_VIEW,
  };
};

const getPropertiesListViewSuccess = (asset: AssetSearch): IFluxStandardAction<IAssetSearch> => {
  return {
    type: SearchActionTypes.GET.PROPERTIES_LIST_VIEW_SUCCESS,
    payload: ObjectMapper.serialize(asset),
  };
};

const getPropertiesListViewFailure = (error: string): IFluxStandardAction => {
  return {
    type: SearchActionTypes.GET.PROPERTIES_LIST_VIEW_FAILURE,
    error,
  };
};

export type SearchPayloadTypes = string | number | IAssetSearch | IFilter | IFilterDetails | undefined;

export const SearchActions = {
  getFilterDetails,
  getFilterDetailsSuccess,
  getFilterDetailsFailure,
  setFilter,
  getProperties,
  getPropertiesSuccess,
  getPropertiesFailure,
  setInitialFilters,
  setInitialState,
  getPropertiesListView,
  getPropertiesListViewSuccess,
  getPropertiesListViewFailure,
};
