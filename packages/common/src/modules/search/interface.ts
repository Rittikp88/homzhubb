import { IAssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { IFilterDetails } from '@homzhub/common/src/domain/models/FilterDetail';
import { IFilter } from '@homzhub/common/src/domain/models/Search';

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
