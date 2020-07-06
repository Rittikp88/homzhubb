import { IPropertyState } from '@homzhub/common/src/modules/property/interface';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { PropertyActionTypes, PropertyPayloadTypes } from '@homzhub/common/src/modules/property/actions';
import { IPropertyDetailsData, IRentServiceList, TypeOfSale } from '@homzhub/common/src/domain/models/Property';
import { IServiceCategory, IServiceDetail, IServiceListStepsDetail } from '@homzhub/common/src/domain/models/Service';

export const initialPropertyState: IPropertyState = {
  currentPropertyId: 0,
  termId: 0,
  serviceCategory: {
    id: 0,
    typeOfSale: TypeOfSale.FIND_TENANT,
  },
  propertyDetails: {
    propertyGroup: null,
    rentServices: null,
  },
  servicesInfo: [],
  servicesSteps: {
    steps: [],
    PROPERTY_VERIFICATIONS: false,
    PAYMENT_TOKEN_AMOUNT: false,
  },
  error: {
    property: '',
    service: '',
  },
  loaders: {
    property: false,
    service: false,
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
    case PropertyActionTypes.SET.TERM_ID:
      return { ...state, ['termId']: action.payload as number };
    case PropertyActionTypes.SET.SERVICE_CATEGORY:
      return { ...state, ['serviceCategory']: action.payload as IServiceCategory };
    case PropertyActionTypes.GET.SERVICE_DETAILS:
    case PropertyActionTypes.GET.SERVICE_STEPS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['service']: true },
        ['error']: { ...state.error, ['service']: '' },
      };
    case PropertyActionTypes.GET.SERVICE_DETAILS_SUCCESS:
      return {
        ...state,
        ['servicesInfo']: action.payload as IServiceDetail[],
        ['loaders']: { ...state.loaders, ['service']: false },
      };
    case PropertyActionTypes.GET.SERVICE_STEPS_SUCCESS:
      return {
        ...state,
        ['servicesSteps']: action.payload as IServiceListStepsDetail,
        ['loaders']: { ...state.loaders, ['service']: false },
      };
    case PropertyActionTypes.GET.SERVICE_DETAILS_FAILURE:
    case PropertyActionTypes.GET.SERVICE_STEPS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['service']: false },
        ['error']: { ...state.error, ['service']: action.error as string },
      };
    default:
      return state;
  }
};
