import { IOwnerState } from './interface';
import { IFluxStandardAction } from '../interfaces';
import { OwnerActionTypes } from './actions';

// TODO: For reference (remove)

export const initialOwnerState: IOwnerState = {
  data: null,
  error: {
    owner: '',
  },
  loaders: {
    owner: false,
  },
};

export const ownerReducer = (state: IOwnerState = initialOwnerState, action: IFluxStandardAction): IOwnerState => {
  switch (action.type) {
    case OwnerActionTypes.GET.FETCH_GET_DETAIL:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['owner']: true },
        ['error']: { ...state.error, ['owner']: '' },
      };
    case OwnerActionTypes.GET.FETCH_GET_DETAIL_SUCCESS:
      return {
        ...state,
        ['data']: action.payload,
        ['loaders']: { ...state.loaders, ['owner']: false },
      };
    case OwnerActionTypes.GET.FETCH_GET_DETAIL_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['owner']: false },
        ['error']: { ...state.error, ['owner']: '' },
      };
    default:
      return state;
  }
};
