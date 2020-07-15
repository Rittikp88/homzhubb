import { IFilter, IFilterDetails, IPropertiesObject } from '@homzhub/common/src/domain/models/Search';

export interface ISearchState {
  filter: IFilter | null;
  filterDetails: IFilterDetails | null;
  properties: IPropertiesObject;
  error: {
    search: string;
  };
  loaders: {
    search: boolean;
  };
}
