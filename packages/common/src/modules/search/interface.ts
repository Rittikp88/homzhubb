import { IFilter, IFilterDetails } from '@homzhub/common/src/domain/models/Search';
import { IAssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';

export interface ISearchState {
  filter: IFilter;
  filterDetails: IFilterDetails | null;
  properties: IAssetSearch;
  error: {
    search: string;
  };
  loaders: {
    search: boolean;
  };
}
