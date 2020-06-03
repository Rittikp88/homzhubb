import { IPropertyDetailsData } from '@homzhub/common/src/domain/models/Property';

export interface IPropertyState {
  propertyDetails: {
    propertyGroup: IPropertyDetailsData[] | null;
  };
  error: {
    property: string;
  };
  loaders: {
    property: boolean;
  };
}
