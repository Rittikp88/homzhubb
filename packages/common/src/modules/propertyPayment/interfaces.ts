import { ISociety } from '@homzhub/common/src/domain/models/Society';

export interface IPropertyPaymentState {
  selectedAssetId: number;
  societyFormData: ISocietyFormData;
  societies: ISociety[];
  loaders: {
    getSocieties: boolean;
  };
}

export interface ISocietyFormData {
  projectName: string;
  propertyName: string;
  societyName: string;
  name: string;
  contactNumber: string;
  email: string;
}
