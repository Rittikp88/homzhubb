import { DateUtils } from '@homzhub/common/src/utils/DateUtils';
import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ISearchState } from '@homzhub/common/src/modules/search/interface';
import { SearchActionTypes, SearchPayloadTypes } from '@homzhub/common/src/modules/search/actions';
import { IAssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { IFilterDetails } from '@homzhub/common/src/domain/models/FilterDetail';
import { IFilter } from '@homzhub/common/src/domain/models/Search';

export const initialSearchState: ISearchState = {
  filter: {
    asset_group: 1,
    asset_transaction_type: 0,
    search_latitude: 0,
    search_longitude: 0,
    asset_type: [],
    min_price: -1,
    max_price: -1,
    min_area: -1,
    max_area: -1,
    area_unit: 1,
    furnishing_status: '',
    room_count: [-1],
    bath_count: -1,
    search_address: '',
    limit: 10,
    offset: 0,
    currency_code: '',
    sort_by: '',
    is_sorting: false,
    miscellaneous: {
      show_verified: false,
      agent_listed: false,
      search_radius: -1,
      date_added: -1,
      property_age: -1,
      rent_free_period: -1,
      expected_move_in_date: DateUtils.getCurrentMonthLastDate(),
      facing: [],
      furnishing: [],
      propertyAmenity: [],
    },
  },
  filterDetails: null,
  properties: {
    count: 0,
    links: {
      next: '',
      previous: '',
    },
    results: [],
  },
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
  const { search_latitude, search_longitude, search_address, currency_code } = state.filter;
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
    currency_code,
  };
  switch (action.type) {
    case SearchActionTypes.GET.FILTER_DETAILS:
    case SearchActionTypes.GET.PROPERTIES:
    case SearchActionTypes.GET.PROPERTIES_LIST_VIEW:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['search']: true },
        ['error']: { ...state.error, ['search']: '' },
      };
    case SearchActionTypes.GET.FILTER_DETAILS_FAILURE:
    case SearchActionTypes.GET.PROPERTIES_FAILURE:
    case SearchActionTypes.GET.PROPERTIES_LIST_VIEW_FAILURE:
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['search']: false },
        ['error']: { ...state.error, ['search']: action.error as string },
      };
    case SearchActionTypes.SET.INITIAL_FILTERS:
      return { ...state, ['filter']: { ...state.filter, ...filterData } };
    case SearchActionTypes.SET.INITIAL_STATE: {
      return { ...initialSearchState };
    }
    case SearchActionTypes.SET.FILTER:
      return {
        ...state,
        ['filter']: { ...state.filter, ...(action.payload as IFilter) },
        ['loaders']: { ...state.loaders, ['search']: false },
      };
    case SearchActionTypes.GET.FILTER_DETAILS_SUCCESS:
      return {
        ...state,
        ['filterDetails']: action.payload as IFilterDetails,
        ['loaders']: { ...state.loaders, ['search']: false },
      };
    case SearchActionTypes.GET.PROPERTIES_SUCCESS:
      return {
        ...state,
        ['properties']: action.payload as IAssetSearch,
        ['loaders']: { ...state.loaders, ['search']: false },
      };
    case SearchActionTypes.GET.PROPERTIES_LIST_VIEW_SUCCESS:
      if (!action.payload) return state;
      // eslint-disable-next-line no-case-declarations
      const { count, links, results } = action.payload as IAssetSearch;
      return {
        ...state,
        ['properties']: {
          ...state.properties,
          count,
          links,
          results: state.filter.is_sorting ? results : [...state.properties.results, ...results],
        },
        ['loaders']: { ...state.loaders, ['search']: false },
      };
    case SearchActionTypes.SET.INITIAL_MISCELLANEOUS:
      return { ...state, ['filter']: { ...state.filter, miscellaneous: initialSearchState.filter.miscellaneous } };
    default:
      return state;
  }
};
