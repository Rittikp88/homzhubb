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

export interface ITransactionRange {
  min: number;
  max: number;
}

export interface IFilters {
  asset_group: IAssetGroup;
  transaction_type: ITransactionType[];
}

export interface ISpaces extends IAssetTypes {
  count: number;
}

export interface IPropertyTerm {
  id: number;
  expected_price: string;
  currency_code: string;
}

export interface IImages {
  file_name: string;
  is_cover_image: boolean;
  link: string;
}

export interface IAmenitiesIcons {
  icon: string;
  iconSize: number;
  iconColor: string;
  label: string;
}

export interface IFilterDetails {
  currency: ICurrency[];
  asset_group_list: IAssetGroupList[];
  filters: IFilters;
}

export interface IFilter {
  search_latitude: number;
  search_longitude: number;
  asset_transaction_type: number;
  asset_type: number[];
  min_price: number;
  max_price: number;
  min_area: number;
  max_area: number;
  furnishing_status: string;
  room_count: number[];
  bath_count: number;
  is_verified: boolean;
  asset_group: number;
  search_address: string;
  limit: number;
  offset: number;
}

export interface IProperties {
  id: number;
  asset_group: IAssetTypes;
  project_name: string;
  unit_number: string;
  block_number: string;
  latitude: string;
  longitude: string;
  carpet_area: string;
  carpet_area_unit: string;
  floor_number: number;
  total_floors: number;
  asset_type: IAssetTypes;
  spaces: ISpaces[];
  lease_term?: IPropertyTerm | null;
  sale_term?: IPropertyTerm | null;
  images: IImages[];
}

export interface IPropertiesObject {
  count: number;
  links: {
    next: string | null;
    previous: string | null;
  };
  results: IProperties[];
}
