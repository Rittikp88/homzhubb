import { IAssetSearch } from '@homzhub/common/src/domain/models/AssetSearch';
import { IFilterDetails } from '@homzhub/common/src/domain/models/FilterDetail';
import { IFilter } from '@homzhub/common/src/domain/models/Search';

export interface ISearchState {
  filter: IFilter;
  filterDetails: IFilterDetails | null;
  properties: IAssetSearch;
  searchBar: {
    latLng: ILatLng;
  };
  error: {
    search: string;
  };
  loaders: {
    search: boolean;
  };
}

export interface ILatLng {
  lat: number;
  lng: number;
}
