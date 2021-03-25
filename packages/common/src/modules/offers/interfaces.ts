import { TenantPreference } from '@homzhub/common/src/domain/models/TenantInfo';
import { PaidByTypes } from '@homzhub/common/src/constants/Terms';

export interface IOwnerProposalsLease {
  expectedPrice: string;
  securityDeposit: string;
  minimumLeasePeriod: number;
  maximumLeasePeriod: number;
  annualRentIncrementPercentage: string;
  availableFromDate: string;
  maintenancePaidBy: PaidByTypes;
  utilityPaidBy: PaidByTypes;
  tenantPreferences: TenantPreference[];
}

export interface IOwnerProposalsSale {
  expectedPrice: string;
  expectedBookingAmount: string;
}
