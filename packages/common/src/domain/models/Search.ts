export interface ICurrency {
  currency_code: string;
  currency_symbol: string;
}

export interface IAssetGroupList {
  id: number;
  name: string;
  title: string;
}

export interface IAssetTypes {
  id: number;
  name: string;
}

export interface IAssetGroup {
  id: number;
  name: string;
  asset_types: IAssetTypes[];
  space_types: IAssetTypes[];
}

export interface ITransactionType {
  title: string;
  label: string;
  min_price: number;
  max_price: number;
}

export interface IFilters {
  asset_group: IAssetGroup;
  transaction_type: ITransactionType[];
}

export interface IFilterDetails {
  currency: ICurrency[];
  asset_group_list: IAssetGroupList[];
  filters: IFilters;
}

export interface IFilter {
  search_latitude: number;
  search_longitude: number;
  asset_transaction_type: string;
  device_type: string;
  browser_type: string;
  asset_type: number[];
  user_location_latitude: number;
  user_location_longitude: number;
  ip_address: string;
  search_output_count: number;
  min_price: number;
  max_price: number;
  furnishing_status: string;
  room_count: number;
  bath_count: number;
  is_verified: boolean;
  asset_group: number;
}
