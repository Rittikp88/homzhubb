import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IOffer } from '@homzhub/common/src/domain/models/Offer';
import { ListingType } from '@homzhub/common/src/domain/repositories/interfaces';
import { PaidByTypes } from '@homzhub/common/src/constants/Terms';
import { ICheckboxGroupData } from '@homzhub/common/src/components/molecules/CheckboxGroup';

export interface IOfferState {
  currentOffer: ICurrentOffer | null;
  negotiations: IOffer[];
  listingDetail: IAsset | null;
  compareData: IOfferCompare;
  loaders: {
    negotiations: boolean;
    listingDetail: boolean;
  };
}

export interface ICurrentOffer {
  type: ListingType;
  listingId: number;
}

export interface IOwnerProposalsLease {
  expectedPrice: string;
  securityDeposit: string;
  minimumLeasePeriod: number;
  maximumLeasePeriod: number;
  annualRentIncrementPercentage: string;
  availableFromDate: string;
  maintenancePaidBy: PaidByTypes;
  utilityPaidBy: PaidByTypes;
  tenantPreferences: ICheckboxGroupData[];
}

export interface IOwnerProposalsSale {
  expectedPrice: string;
  expectedBookingAmount: string;
}

export interface IOfferCompare {
  rent?: number;
  price?: number;
  deposit?: number;
  bookingAmount?: number;
  incrementPercentage?: number;
}
