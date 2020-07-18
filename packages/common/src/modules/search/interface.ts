import { IFilter, IFilterDetails, IPropertiesObject } from '@homzhub/common/src/domain/models/Search';

export interface ISearchState {
  filter: IFilter;
  filterDetails: IFilterDetails | null;
  properties: IPropertiesObject | null;
  error: {
    search: string;
  };
  loaders: {
    search: boolean;
  };
}
