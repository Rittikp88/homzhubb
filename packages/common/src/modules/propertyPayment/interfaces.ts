import { ISociety } from '@homzhub/common/src/domain/models/Society';

export interface IPropertyPaymentState {
  selectedAssetId: number;
  societies: ISociety[];
  loaders: {
    getSocieties: boolean;
  };
}
