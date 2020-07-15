import { IFluxStandardAction } from '@homzhub/common/src/modules/interfaces';
import { ISearchState } from '@homzhub/common/src/modules/search/interface';

export const initialSearchState: ISearchState = {
  filter: null,
  filterDetails: null,
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
