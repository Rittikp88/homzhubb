export enum TypeOfSale {
  FIND_TENANT = 'FIND_TENANT',
  SELL_PROPERTY = 'SELL_PROPERTY',
  TENANT_FOUND = 'TENANT_FOUND',
}

export interface IPropertyTypes {
  id: string | number;
  name: string;
}

export interface IPropertyDetailsData {
  id: string | number;
  name: string;
  asset_types: IPropertyTypes[];
  space_types: IPropertyTypes[];
}

export interface IRentServiceList {
  id: number;
  name: TypeOfSale;
  label: string;
  icon: string;
}
