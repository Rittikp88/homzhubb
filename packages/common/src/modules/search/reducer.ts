import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ISearchState } from '@homzhub/common/src/modules/search/interface';
import { SearchActionTypes, SearchPayloadTypes } from '@homzhub/common/src/modules/search/actions';
import { IFilterDetails, IFilter, IPropertiesObject } from '@homzhub/common/src/domain/models/Search';

export const initialSearchState: ISearchState = {
  filter: {
    asset_group: 1,
    asset_transaction_type: 0,
    search_latitude: 0,
    search_longitude: 0,
    asset_type: [],
    min_price: -1,
    max_price: -1,
    furnishing_status: '',
    room_count: [-1],
    bath_count: -1,
    is_verified: false,
    search_address: '',
    limit: 10,
    offset: 0,
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
  action: IFluxStandardAction<SearchPayloadTypes>
): ISearchState => {
  // Handle the reset filter but not deleting the lat, long and address
  // TODO: Need a better way for resetting the filter
  const { search_latitude, search_longitude, search_address } = state.filter;
  const filterData = {
    search_latitude,
    search_longitude,
    search_address,
    room_count: [-1],
    bath_count: -1,
    min_price: -1,
    max_price: -1,
    asset_type: [],
    limit: 10,
    offset: 0,
  };
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
        ['filterDetails']: action.payload as IFilterDetails,
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
        ['properties']: action.payload as IPropertiesObject,
        ['loaders']: { ...state.loaders, ['search']: false },
      };
    case SearchActionTypes.SET.FILTER:
      return {
        ...state,
        ['filter']: { ...state.filter, ...(action.payload as IFilter) },
        ['loaders']: { ...state.loaders, ['search']: false },
      };
    case SearchActionTypes.SET.INITIAL_FILTERS:
      return { ...state, ['filter']: { ...state.filter, ...filterData } };
    case SearchActionTypes.SET.INITIAL_STATE: {
      return { ...initialSearchState };
    }
    default:
      return state;
  }
};
