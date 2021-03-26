import { AssetSelectors } from '@homzhub/common/src/modules/asset/selectors';
import { IOwnerProposalsLease, IOwnerProposalsSale } from '@homzhub/common/src/modules/offers/interfaces';
import { IState } from '@homzhub/common/src/modules/interfaces';
import { ICheckboxGroupData } from '@homzhub/common/src/components/molecules/CheckboxGroup';

const getOwnerProposalsRent = (state: IState): IOwnerProposalsLease | null => {
  const asset = AssetSelectors.getAsset(state);
  if (asset && asset?.leaseTerm) {
    const {
      expectedPrice,
      securityDeposit,
      minimumLeasePeriod,
      maximumLeasePeriod,
      annualRentIncrementPercentage,
      availableFromDate,
      maintenancePaidBy,
      utilityPaidBy,
      tenantPreferences,
    } = asset.leaseTerm;
    return {
      expectedPrice: `${expectedPrice}`,
      securityDeposit: `${securityDeposit}`,
      minimumLeasePeriod,
      maximumLeasePeriod,
      annualRentIncrementPercentage: annualRentIncrementPercentage ? `${annualRentIncrementPercentage}` : '',
      availableFromDate,
      maintenancePaidBy,
      utilityPaidBy,
      tenantPreferences: tenantPreferences.map((item) => ({ id: item.id, label: item.name, isSelected: true })),
    };
  }
  return null;
};

const getOwnerProposalsSale = (state: IState): IOwnerProposalsSale | null => {
  const asset = AssetSelectors.getAsset(state);
  if (asset && asset?.saleTerm) {
    const { expectedPrice, expectedBookingAmount } = asset.saleTerm;
    return {
      expectedPrice: `${expectedPrice}`,
      expectedBookingAmount: `${expectedBookingAmount}`,
    };
  }
  return null;
};

const getFormattedTenantPreferences = (state: IState, value = true): ICheckboxGroupData[] => {
  const asset = AssetSelectors.getAsset(state);
  if (asset && asset.leaseTerm?.tenantPreferences) {
    const formatted: ICheckboxGroupData[] = asset.leaseTerm?.tenantPreferences.map((item) => ({
      id: item.id,
      label: item.name,
      isSelected: value,
    }));
    return formatted;
  }
  return [];
};

export const OfferSelectors = {
  getOwnerProposalsRent,
  getOwnerProposalsSale,
  getFormattedTenantPreferences,
};
