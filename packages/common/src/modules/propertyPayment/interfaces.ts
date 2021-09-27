import { ISociety } from '@homzhub/common/src/domain/models/Society';
import { IBankInfoPayload, ISocietyPayload } from '@homzhub/common/src/domain/repositories/interfaces';
import { MenuEnum } from '@homzhub/common/src/constants/Society';
import { ISocietyCharge } from '@homzhub/common/src/domain/models/SocietyCharge';

export interface IPropertyPaymentState {
  selectedAssetId: number;
  selectedSocietyId: number;
  societyFormData: ISocietyFormData;
  societyBankData: IBankInfoPayload | null;
  societies: ISociety[];
  societyDetail: ISociety | null;
  societyCharges: ISocietyCharge | null;
  loaders: {
    getSocieties: boolean;
    society: boolean;
    societyCharges: boolean;
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

export interface IUpdateSociety {
  action: MenuEnum;
  societyId: number;
  payload?: ISocietyPayload;
  onCallback?: (status: boolean) => void;
}

export interface ICreateSociety {
  payload: ISocietyPayload;
  onCallback?: (status: boolean) => void;
}

export interface IGetSocietyPayload {
  societyId: number;
  isForUpdate?: boolean;
}
