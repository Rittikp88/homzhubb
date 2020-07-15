import { IFilter, IFilterDetails } from '@homzhub/common/src/domain/models/Search';

export interface ISearchState {
  filter: IFilter | null;
  filterDetails: IFilterDetails | null;
  error: {
    search: string;
  };
  loaders: {
    search: boolean;
  };
}
