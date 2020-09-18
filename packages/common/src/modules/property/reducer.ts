import { IPropertyState } from '@homzhub/common/src/modules/property/interface';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { PropertyActionTypes, PropertyPayloadTypes } from '@homzhub/common/src/modules/property/actions';
import { IPropertyDetailsData } from '@homzhub/common/src/domain/models/Property';

export const initialPropertyState: IPropertyState = {
  currentPropertyId: 0,
  termId: 0,
  propertyDetails: {
    propertyGroup: null,
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
        ['propertyDetails']: {
          ...state.propertyDetails,
          ['propertyGroup']: action.payload as IPropertyDetailsData[],
        },
        ['loaders']: { ...state.loaders, ['property']: false },
      };
    case PropertyActionTypes.GET.PROPERTY_DETAILS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['property']: false },
        ['error']: { ...state.error, ['property']: action.error as string },
      };
    case PropertyActionTypes.SET.CURRENT_PROPERTY_ID:
      return { ...state, ['currentPropertyId']: action.payload as number };
    case PropertyActionTypes.SET.TERM_ID:
      return { ...state, ['termId']: action.payload as number };
    case PropertyActionTypes.SET.INITIAL_STATE:
      return { ...state, ...initialPropertyState };
    default:
      return state;
  }
};
