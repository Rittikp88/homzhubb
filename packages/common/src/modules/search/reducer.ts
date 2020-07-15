import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ISearchState } from '@homzhub/common/src/modules/search/interface';
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
    default:
      return state;
  }
};
