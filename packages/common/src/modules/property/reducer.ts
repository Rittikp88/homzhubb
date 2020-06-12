import { IPropertyState } from '@homzhub/common/src/modules/property/interface';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { PropertyActionTypes, PropertyPayloadTypes } from '@homzhub/common/src/modules/property/actions';
import { IPropertyDetailsData, IRentServiceList } from '@homzhub/common/src/domain/models/Property';

export const initialPropertyState: IPropertyState = {
  currentPropertyId: 0,
  propertyDetails: {
    propertyGroup: null,
    rentServices: null,
  },
  error: {
    property: '',
  },
  loaders: {
    property: false,
  },
};

export const propertyReducer = (
  state: IPropertyState = initialPropertyState,
  action: IFluxStandardAction<PropertyPayloadTypes>
): IPropertyState => {
  switch (action.type) {
    case PropertyActionTypes.GET.PROPERTY_DETAILS:
    case PropertyActionTypes.GET.RENT_SERVICE_LIST:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['property']: true },
        ['error']: { ...state.error, ['property']: '' },
      };
    case PropertyActionTypes.GET.PROPERTY_DETAILS_SUCCESS:
      return {
        ...state,
        ['propertyDetails']: {
          ...state.propertyDetails,
          ['propertyGroup']: action.payload as IPropertyDetailsData[],
        },
        ['loaders']: { ...state.loaders, ['property']: false },
      };
    case PropertyActionTypes.GET.PROPERTY_DETAILS_FAILURE:
    case PropertyActionTypes.GET.RENT_SERVICE_LIST_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['property']: false },
        ['error']: { ...state.error, ['property']: action.error as string },
      };
    case PropertyActionTypes.GET.RENT_SERVICE_LIST_SUCCESS:
      return {
        ...state,
        ['propertyDetails']: {
          ...state.propertyDetails,
          ['rentServices']: action.payload as IRentServiceList[],
        },
        ['loaders']: { ...state.loaders, ['property']: false },
      };
    case PropertyActionTypes.SET.CURRENT_PROPERTY_ID:
      return { ...state, ['currentPropertyId']: action.payload as number };
    default:
      return state;
  }
};
