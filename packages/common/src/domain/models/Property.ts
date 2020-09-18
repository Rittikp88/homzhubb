export interface IPropertyTypes {
  id: string | number;
  name: string;
}

export interface IPropertyDetailsData {
  id: string | number;
  name: string;
  title?: string;
  asset_types: IPropertyTypes[];
  space_types: IPropertyTypes[];
}
