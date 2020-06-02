import { IPropertyState } from '@homzhub/common/src/modules/property/interface';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { PropertyActionTypes, PropertyPayloadTypes } from '@homzhub/common/src/modules/property/actions';
import { PropertyAssetGroupData, ResidentialPropertyTypeData } from '@homzhub/common/src/mocks/PropertyDetails';

export const initialPropertyState: IPropertyState = {
  propertyDetails: {
    propertyGroup: [],
    propertyGroupSpaceAvailable: [],
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
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['property']: true },
        ['error']: { ...state.error, ['property']: '' },
      };
    case PropertyActionTypes.GET.PROPERTY_DETAILS_SUCCESS:
      return {
        ...state,
        ['propertyDetails']: { ...state.propertyDetails, ['propertyGroup']: PropertyAssetGroupData }, // TODO: Add the data here once the api is ready
        ['loaders']: { ...state.loaders, ['property']: false },
      };
    case PropertyActionTypes.GET.PROPERTY_DETAILS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['property']: false },
        ['error']: { ...state.error, ['property']: action.error as string },
      };

    case PropertyActionTypes.GET.PROPERTY_DETAILS_BY_ID:
      // eslint-disable-next-line no-case-declarations
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['property']: true },
        ['propertyDetails']: {
          ...state.propertyDetails,
          ['propertyGroupSpaceAvailable']: ResidentialPropertyTypeData,
        }, // TODO: Remove once the api is ready
        ['error']: { ...state.error, ['property']: '' },
      };
    case PropertyActionTypes.GET.PROPERTY_DETAILS_BY_ID_SUCCESS:
      return {
        ...state,
        // ['propertyDetails']: { ...state.propertyDetails, ['propertyGroup']: PropertyAssetGroupData }, // TODO: Add the data here once the api is ready
        ['loaders']: { ...state.loaders, ['property']: false },
      };
    case PropertyActionTypes.GET.PROPERTY_DETAILS_BY_ID_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['property']: false },
        ['error']: { ...state.error, ['property']: action.error as string },
      };
    default:
      return state;
  }
};
