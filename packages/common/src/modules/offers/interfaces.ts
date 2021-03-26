import { PaidByTypes } from '@homzhub/common/src/constants/Terms';
import { ICheckboxGroupData } from '@homzhub/common/src/components/molecules/CheckboxGroup';

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
