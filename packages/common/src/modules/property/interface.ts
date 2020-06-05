import { IPropertyDetailsData, IRentServiceList } from '@homzhub/common/src/domain/models/Property';

export interface IPropertyState {
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
