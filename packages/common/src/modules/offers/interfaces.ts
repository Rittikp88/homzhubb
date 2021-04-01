import { IAsset } from '@homzhub/common/src/domain/models/Asset';
import { IOffer, Offer } from '@homzhub/common/src/domain/models/Offer';
import { ListingType } from '@homzhub/common/src/domain/repositories/interfaces';
import { ICheckboxGroupData } from '@homzhub/common/src/components/molecules/CheckboxGroup';

export interface IOfferState {
  currentOfferPayload: ICurrentOffer | null;
  negotiations: IOffer[];
  currentOffer: Offer | null;
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

export interface IExistingProposalsLease {
  expectedPrice: string;
  securityDeposit: string;
  minimumLeasePeriod: number;
  maximumLeasePeriod: number;
  annualRentIncrementPercentage: string;
  availableFromDate: string;
  maintenancePaidBy: string;
  utilityPaidBy: string;
  tenantPreferences: ICheckboxGroupData[];
}

export interface IExistingProposalsSale {
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

export interface IFormattedDetails {
  type: string;
  value: string | number | null;
}
