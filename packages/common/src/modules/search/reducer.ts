import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ISearchState } from '@homzhub/common/src/modules/search/interface';
import { SearchActionTypes } from '@homzhub/common/src/modules/search/actions';

export const initialSearchState: ISearchState = {
  filter: {
    asset_group: 1,
    asset_transaction_type: 0,
    search_latitude: 0,
    search_longitude: 0,
    asset_type: [1],
    min_price: -1,
    max_price: -1,
    furnishing_status: '',
    room_count: [-1],
    bath_count: -1,
    is_verified: false,
    search_address: '',
  },
  filterDetails: null,
  properties: null,
  error: {
    search: '',
  },
  loaders: {
    search: false,
  },
};

export const searchReducer = (
  state: ISearchState = initialSearchState,
  action: IFluxStandardAction<any> // TODO: To be added
): ISearchState => {
  switch (action.type) {
    case SearchActionTypes.GET.FILTER_DETAILS:
    case SearchActionTypes.GET.PROPERTIES:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['search']: true },
        ['error']: { ...state.error, ['search']: '' },
      };
    case SearchActionTypes.GET.FILTER_DETAILS_SUCCESS:
      return {
        ...state,
        ['filterDetails']: action.payload,
        ['loaders']: { ...state.loaders, ['search']: false },
      };
    case SearchActionTypes.GET.FILTER_DETAILS_FAILURE:
    case SearchActionTypes.GET.PROPERTIES_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['search']: false },
        ['error']: { ...state.error, ['search']: action.error as string },
      };
    case SearchActionTypes.GET.PROPERTIES_SUCCESS:
      return {
        ...state,
        ['properties']: action.payload,
        ['loaders']: { ...state.loaders, ['search']: false },
      };
    case SearchActionTypes.SET.FILTER:
      console.log(action.payload, 'reducer');
      return {
        ...state,
        ['filter']: { ...state.filter, ...action.payload },
        ['loaders']: { ...state.loaders, ['search']: false },
      };
    default:
      return state;
  }
};
