/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IPropertyDetailsData } from '@homzhub/common/src/domain/models/Property';

const actionTypePrefix = 'Property/';

export const PropertyActionTypes = {
  GET: {
    PROPERTY_DETAILS: `${actionTypePrefix}PROPERTY_DETAILS`,
    PROPERTY_DETAILS_SUCCESS: `${actionTypePrefix}PROPERTY_DETAILS_SUCCESS`,
    PROPERTY_DETAILS_FAILURE: `${actionTypePrefix}PROPERTY_DETAILS_FAILURE`,
  },
};

const getPropertyDetails = (): IFluxStandardAction => {
  return {
    type: PropertyActionTypes.GET.PROPERTY_DETAILS,
  };
};

const getPropertyDetailsSuccess = (data: IPropertyDetailsData): IFluxStandardAction<IPropertyDetailsData> => {
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

export type PropertyPayloadTypes = string | IPropertyDetailsData[];
export const PropertyActions = {
  getPropertyDetails,
  getPropertyDetailsSuccess,
  getPropertyDetailsFailure,
};
