import { IPropertyDetailsData } from '@homzhub/common/src/domain/models/Property';

export interface IPropertyState {
  currentPropertyId: number;
  termId: number;
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
