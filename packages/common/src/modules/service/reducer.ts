import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { IServiceState } from '@homzhub/common/src/modules/service/interface';
import { ServiceActionTypes, ServicePayloadTypes } from '@homzhub/common/src/modules/service/actions';
import { IServiceDetail } from '@homzhub/common/src/domain/models/Service';

export const initialServiceState: IServiceState = {
  servicesData: [],
  error: {
    service: '',
  },
  loaders: {
    service: false,
  },
};

export const serviceReducer = (
  state: IServiceState = initialServiceState,
  action: IFluxStandardAction<ServicePayloadTypes>
): IServiceState => {
  switch (action.type) {
    case ServiceActionTypes.GET.SERVICE_DETAILS:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['service']: true },
        ['error']: { ...state.error, ['service']: '' },
      };
    case ServiceActionTypes.GET.SERVICE_DETAILS_SUCCESS:
      return {
        ...state,
        ['servicesData']: action.payload as IServiceDetail[],
        ['loaders']: { ...state.loaders, ['service']: false },
      };
    case ServiceActionTypes.GET.SERVICE_DETAILS_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['service']: false },
        ['error']: { ...state.error, ['service']: action.error as string },
      };
    default:
      return state;
  }
};
