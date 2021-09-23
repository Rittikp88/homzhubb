import { ISociety } from '@homzhub/common/src/domain/models/Society';
import { IBankInfoPayload } from '@homzhub/common/src/domain/repositories/interfaces';

export interface IPropertyPaymentState {
  selectedAssetId: number;
  societyFormData: ISocietyFormData;
  societyBankData: IBankInfoPayload | null;
  societies: ISociety[];
  loaders: {
    getSocieties: boolean;
    society: boolean;
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
