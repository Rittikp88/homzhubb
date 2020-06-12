import { IPropertyDetailsData, IRentServiceList } from '@homzhub/common/src/domain/models/Property';

export interface IPropertyState {
  currentPropertyId: number;
  propertyDetails: {
    propertyGroup: IPropertyDetailsData[] | null;
    rentServices: IRentServiceList[] | null;
  };
  error: {
    property: string;
  };
  loaders: {
    property: boolean;
  };
}
