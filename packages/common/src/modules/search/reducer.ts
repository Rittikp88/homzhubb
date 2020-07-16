import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ISearchState } from '@homzhub/common/src/modules/search/interface';
import { SearchActionTypes } from '@homzhub/common/src/modules/search/actions';
import { PropertySearchData } from '@homzhub/common/src/mocks/PropertySearchData';

export const initialSearchState: ISearchState = {
  filter: null,
  filterDetails: null,
  properties: PropertySearchData, // TODO: To be remove once the api call is set
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
      return {
        ...state,
        ['loaders']: { ...state.loaders, ['search']: false },
        ['error']: { ...state.error, ['search']: action.error as string },
      };
    default:
      return state;
  }
};
