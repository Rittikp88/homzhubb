export interface IPropertyTypes {
  id: string | number;
  name: string;
}

export interface IPropertyDetailsData {
  id: string | number;
  name: string;
  asset_types: IPropertyTypes[];
}

export interface IRentServiceList {
  id: string | number;
  label: string;
  icon: string;
}
